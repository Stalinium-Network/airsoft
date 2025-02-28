"use client";

import React, { Component, ComponentType } from "react";
import ReactMarkdown from "react-markdown";

export default function RulesWaiver(
    { markdown, CustomComponent }:
        { markdown: string, CustomComponent?: ComponentType<any> }
) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-10">
            <main className="container mx-auto px-4 pt-12 max-w-4xl">
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-2xl">
                    {CustomComponent &&
                        React.createElement(CustomComponent as React.ComponentType<any>)}
                    {/* Render the markdown content */}
                    <div className="prose prose-invert max-w-none space-y-8">
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </main>
        </div>
    );
}
