"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function ApartmentDetails({ params }) {
  const { id } = params;
  const [apartment, setApartment] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (id) {
      fetchApartmentDetails(id);
    }
  }, [id]);

  const fetchApartmentDetails = async (id) => {
    const { data, error } = await supabase
      .from('apartments')
      .select('*, rooms(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching apartment details:', error);
    } else {
      setApartment(data);
      setRooms(data.rooms || []);
    }
  };

  if (!apartment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        <style jsx>{`
          .loader {
            border-top-color: #3498db;
            animation: spinner 1.5s linear infinite;
          }
          @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">{apartment.name}</h1>
        <p className="text-gray-600"><strong>Location:</strong> {apartment.location}</p>
        <p className="text-gray-600"><strong>Price:</strong> {apartment.price}</p>
        <p className="text-gray-600"><strong>Description:</strong> {apartment.description}</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Rooms</h2>
        <ul className="space-y-4 mt-4">
          {rooms.map(room => (
            <li key={room.id} className="p-4 border rounded shadow bg-white">
              <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
              <p className="text-gray-600"><strong>Size:</strong> {room.size} sqm</p>
              <p className="text-gray-600"><strong>Equipment:</strong> {room.equipment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
