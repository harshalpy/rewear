"use client";

import React, { useState, useRef } from "react";
import axios from "axios";

const ListItemPage = () => {
    return (
        <div className="min-h-screen px-4 py-6 bg-[#F5F2F2] text-[#3E2F2F]">
            <header className="flex justify-between items-center border-b border-[#DDD4D4] pb-4 mb-8">
                <h1 className="text-2xl font-bold tracking-wide text-[#A6635C]">
                    List Your Clothing Item
                </h1>
                <div />
            </header>
            <ListingForm />
        </div>
    );
};

const ListingForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        size: "",
        condition: "",
        location: "",
        images: [],
    });

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageUpload = (files) => {
        const previewImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setFormData({ ...formData, images: previewImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("category", formData.category.toLowerCase());
            data.append("size", formData.size);
            data.append("condition", formData.condition.toLowerCase());
            data.append("location", formData.location);
            formData.images.forEach((img) => data.append("images", img.file));

            const response = await axios.post("http://localhost:4000/api/products", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert("Item listed successfully!");
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    size: "",
                    condition: "",
                    location: "",
                    images: [],
                });
            } else {
                alert("Submission failed");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("An error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="border rounded-lg h-64 flex items-center justify-center overflow-hidden bg-white border-[#DDD4D4]">
                    {formData.images.length > 0 ? (
                        <img
                            src={formData.images[0].url}
                            alt="Main"
                            className="object-contain h-full w-full"
                        />
                    ) : (
                        <span className="text-sm text-gray-600">Product Image</span>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Product Name"
                        className="p-3 border rounded-md bg-white placeholder:text-gray-500 border-[#DDD4D4] text-[#3E2F2F]"
                        onChange={handleChange}
                        value={formData.title}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Product Description"
                        rows={6}
                        className="p-3 border rounded-md bg-white placeholder:text-gray-500 border-[#DDD4D4] text-[#3E2F2F]"
                        onChange={handleChange}
                        value={formData.description}
                        required
                    ></textarea>
                </div>
            </div>

            <div>
                <p className="font-semibold mb-3 text-[#A6635C]">Product Images</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-28 border rounded-md flex items-center justify-center bg-white overflow-hidden border-[#DDD4D4]"
                        >
                            {formData.images[i] ? (
                                <img
                                    src={formData.images[i].url}
                                    alt={`Image ${i + 1}`}
                                    className="object-cover h-full w-full"
                                />
                            ) : (
                                <span className="text-sm text-gray-500">Image {i + 1}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { name: "category", options: ["Men", "Women", "Kids", "Unisex"] },
                    { name: "size", options: ["XS", "S", "M", "L", "XL"] },
                    { name: "condition", options: ["New", "Gently Used", "Used"] },
                ].map(({ name, options }) => (
                    <select
                        key={name}
                        name={name}
                        className="p-3 border rounded-md bg-white border-[#DDD4D4] text-[#3E2F2F]"
                        onChange={handleChange}
                        value={formData[name]}
                        required
                    >
                        <option value="">{name.charAt(0).toUpperCase() + name.slice(1)}</option>
                        {options.map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                ))}
            </div>

            <input
                type="text"
                name="location"
                placeholder="City / Location"
                className="w-full p-3 border rounded-md bg-white placeholder:text-gray-500 border-[#DDD4D4] text-[#3E2F2F]"
                onChange={handleChange}
                value={formData.location}
            />

            <ImageUploader onUpload={handleImageUpload} />

            <div className="text-center">
                <button
                    type="submit"
                    className="font-semibold px-6 py-2 rounded-md shadow bg-[#A6635C] text-white transition duration-300 hover:opacity-90"
                >
                    Submit Listing
                </button>
            </div>
        </form>
    );
};

const ImageUploader = ({ onUpload }) => {
    const fileRef = useRef();

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        onUpload(files);
    };

    return (
        <div>
            <label className="block mb-2 font-medium text-[#A6635C]">Upload Images</label>
            <input
                type="file"
                multiple
                ref={fileRef}
                onChange={handleFiles}
                accept="image/*"
                className="w-full p-3 border rounded-md bg-white border-[#DDD4D4] text-[#3E2F2F]"
            />
        </div>
    );
};

export default ListItemPage;
