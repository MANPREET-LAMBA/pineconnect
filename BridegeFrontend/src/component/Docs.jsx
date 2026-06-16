import { useState } from "react";
import Download from "./doc/Download";
import Starting from "./doc/Starting";
import Working from "./Working";

export default function Docs() {
    const [activeTab, setActiveTab] = useState("start");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsMenuOpen(false);
    };

    return (
        <div className="w-full min-h-screen pt-16 md:pt-[7%]">
            
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white">
                <h1 className="text-xl font-bold">Documentation</h1>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-3xl"
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden flex flex-col gap-3 p-4 border-b border-white">
                    <button
                        onClick={() => handleTabChange("start")}
                        className="text-left text-lg"
                    >
                        Getting Started
                    </button>

                    <button
                        onClick={() => handleTabChange("download")}
                        className="text-left text-lg"
                    >
                        Download File
                    </button>

                    <button
                        onClick={() => handleTabChange("ea")}
                        className="text-left text-lg"
                    >
                        EA Settings
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-6 w-full min-h-screen">
                
                {/* Desktop Sidebar */}
                <div className="hidden md:flex md:col-span-1 border-r border-white flex-col items-center gap-5 text-xl lg:text-2xl pt-8">
                    <button
                        onClick={() => handleTabChange("start")}
                        className="hover:text-blue-400 transition"
                    >
                        Getting Started
                    </button>

                    <button
                        onClick={() => handleTabChange("download")}
                        className="hover:text-blue-400 transition"
                    >
                        Download File
                    </button>

                    <button
                        onClick={() => handleTabChange("ea")}
                        className="hover:text-blue-400 transition"
                    >
                        EA Settings
                    </button>
                </div>

                {/* Content */}
                <div className="col-span-1 md:col-span-5 w-full px-2 md:px-6 lg:px-10 py-4">
                    {activeTab === "start" && <Starting />}
                    {activeTab === "download" && <Download />}
                    {activeTab === "ea" && <Working />}
                </div>
            </div>
        </div>
    );
}