import React, { Suspense } from "react";
import CodeEditor from "./CodeEditor";

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#080808] text-[#CCFF00] flex items-center justify-center font-mono">INITIALIZING_EDITOR...</div>}>
            <CodeEditor />
        </Suspense>
    );
}
