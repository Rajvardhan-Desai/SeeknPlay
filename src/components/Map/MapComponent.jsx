import React, { useEffect, useState, useRef } from 'react';
import { Alert, AlertIcon, Select } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import useAuthStore from "../../store/authStore";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Overlay from 'ol/Overlay';

const MapComponent = () => {
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const authUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const tooltipRef = useRef(); // Ref for the tooltip overlay element

  useEffect(() => {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip';
    document.body.appendChild(tooltipElement); // Append to body

    const tooltip = new Overlay({
      element: tooltipElement,
      positioning: 'bottom-center',
      stopEvent: false,
    });

    // Initialize the map
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([authUser.latlong[1], authUser.latlong[0]]),
        zoom: 15,
      }),
      overlays: [tooltip],
    });

    map.on('pointermove', function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });

      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        tooltip.setPosition(coordinates);
        tooltipElement.innerHTML = feature.get('fullName') === authUser.fullName ? "You" : feature.get('fullName');
        tooltipElement.style.display = '';
      } else {
        tooltipElement.style.display = 'none';
      }
    });
    
    map.on('click', function(evt) {
      map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        const username = feature.get('username');
        if (username) {
          navigate(`/profile/${username}`);
        }
      });
    });

    // Add a marker for each user
    users.forEach(user => {
      const userLocation = new Feature({
        geometry: new Point(fromLonLat([user.latlong[1], user.latlong[0]])),
        username: user.username,
        fullName: user.fullName,
      });

      userLocation.setStyle(new Style({
        image: new Icon({
          src: user.uid === authUser.uid ? '/placeholder1.png' : '/placeholder copy.png',
          scale: 0.11,
        }),
      }));

      const vectorSource = new VectorSource({
        features: [userLocation],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      map.addLayer(vectorLayer);
    });

    return () => {
      if (map) {
        map.setTarget(null); // Clean up the map instance
      }
      
      if (tooltipElement && document.body.contains(tooltipElement)) {
        document.body.removeChild(tooltipElement); // Clean up the tooltip element
      }

    };
  }, [users, authUser]);

  useEffect(() => {
    if (authUser.sports && authUser.sports.length > 0) {
      const initialSport = authUser.sports[0];
      setSelectedSport(initialSport);
      fetchUsers(initialSport);
    }
  }, [authUser.sports]);

  const fetchUsers = async (sport) => {
    setError('');
    try {
      const q = query(collection(db, "users"), where("sports", "array-contains", sport));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      setError('Failed to fetch users');
      console.error("Error fetching users:", error.message);
    }
  };

  const handleSportChange = (e) => {
    const newSport = e.target.value;
    setSelectedSport(newSport);
    fetchUsers(newSport);
  };

  return (
    <>
      {error && (
        <Alert status='error' fontSize="sm" p={2} borderRadius={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Select value={selectedSport} placeholder="Select sport" onChange={handleSportChange} mb={5}>
        {authUser.sports && authUser.sports.map((sport, index) => (
          <option key={index} value={sport}>{sport}</option>
        ))}
      </Select>
      <div id="map" style={{ width: '100%', height: '70vh', borderRadius: '20px' }}></div>
      <style>{`
        .tooltip {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          margin-bottom:22px;
        }
      `}</style>
    </>
  );
};

export default MapComponent;
