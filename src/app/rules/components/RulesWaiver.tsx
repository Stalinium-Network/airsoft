"use client";

import MarkdownRenderer from "@/components/MarkdownRenderer";
import React, { Component, ComponentType } from "react";

export default function RulesWaiver(
    { markdown, CustomComponent }:
        { markdown: string, CustomComponent?: ComponentType<any> }
) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zone-dark to-black text-white pt-10">
            <main className="container mx-auto px-4 pt-12 max-w-4xl">
                <div className="bg-zone-dark-brown/20 backdrop-filter backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-2xl border border-zone-dark-brown/30">
                    {CustomComponent &&
                        React.createElement(CustomComponent as React.ComponentType<any>)}
                    {/* Render the markdown content */}
                    <div className="prose prose-invert max-w-none space-y-8">
                        <MarkdownRenderer content={markdown} />
                    </div>
                </div>
            </main>
        </div>
    );
}
