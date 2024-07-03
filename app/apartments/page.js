"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function Apartments() {
  const [apartment, setApartment] = useState({ name: "", location: "", price: "", description: "" });
  const [room, setRoom] = useState({ name: "", size: "", equipment: "" });
  const [apartmentId, setApartmentId] = useState(null);
  const [addingRoom, setAddingRoom] = useState(false);
  const [rooms, setRooms] = useState([]);

  const handleApartmentChange = (e) => {
    const { name, value } = e.target;
    setApartment({ ...apartment, [name]: value });
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const addApartment = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("apartments")
      .insert([apartment])
      .select()
      .single();

    if (error) {
      console.error("Error adding apartment:", error);
    } else if (data) {
      setApartmentId(data.id);
      setAddingRoom(true);
    }
  };

  const addRoom = async (e) => {
    e.preventDefault();
    const newRoom = { ...room, apartment_id: apartmentId };
    setRooms([...rooms, newRoom]);

    const { data, error } = await supabase
      .from("rooms")
      .insert([newRoom]);

    if (error) {
      console.error("Error adding room:", error);
    } else {
      console.log("Room added successfully:", data);
      // Reset the room form for the next entry
      setRoom({ name: "", size: "", equipment: "" });
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      {!addingRoom ? (
        <form onSubmit={addApartment} className="space-y-4 bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Add New Apartment</h1>
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={apartment.name}
              onChange={handleApartmentChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={apartment.location}
              onChange={handleApartmentChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={apartment.price}
              onChange={handleApartmentChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={apartment.description}
              onChange={handleApartmentChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300">
            Add Apartment
          </button>
        </form>
      ) : (
        <div>
          <form onSubmit={addRoom} className="space-y-4 bg-white p-6 rounded shadow-md">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Add Room to Apartment</h1>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={room.name}
                onChange={handleRoomChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Size (sqm)</label>
              <input
                type="number"
                name="size"
                value={room.size}
                onChange={handleRoomChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Equipment</label>
              <textarea
                name="equipment"
                value={room.equipment}
                onChange={handleRoomChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                required
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300">
              Add Room
            </button>
          </form>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Added Rooms</h2>
            <ul>
              {rooms.map((r, index) => (
                <li key={index} className="mb-2 p-4 border rounded shadow-sm bg-white text-black">
                  <p><strong>Name:</strong> {r.name}</p>
                  <p><strong>Size:</strong> {r.size} sqm</p>
                  <p><strong>Equipment:</strong> {r.equipment}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
