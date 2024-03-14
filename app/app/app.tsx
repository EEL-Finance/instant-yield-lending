"use client";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function App() {
    const [program, setProgram] = useState("");

    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    useEffect(() => {
        let provider: Anchor.provider
    })

    return (
        <div className="h-full v-full p-5">
            <button></button>
        </div>
    )
}