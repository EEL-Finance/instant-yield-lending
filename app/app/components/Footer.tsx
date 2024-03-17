"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "./styles.css";

/* ------------------------ Components ----------------------- */
export default function Footer() {
    return (
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-bg-d">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-ac-1 sm:text-center dark:text-gray-400">© 2024 <a href="#" className="hover:underline">EEL Finance™</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-ac-1 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="https://twitter.com/EelFinance" className="hover:underline me-4 md:me-6">Twitter (X)</a>
                </li>
                <li>
                    <a href="https://github.com/EEL-Finance" className="hover:underline">Github</a>
                </li>
            </ul>
            </div>
        </footer>
    )
}