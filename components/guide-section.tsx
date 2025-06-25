'use client'

import ChatAnimation from "./ui/chat-animation";
import RequestAnimation from "./ui/request-referral-animation";
import SearchAnimation from "./ui/search_animation";
import SendRequestAnimation from "./ui/send_request_animation";

export default function GuideSection() {
    return (
        <div className="w-full mb-20 flex flex-col items-center gap-10 p-6">
            {/* Step 1: Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl p-8 rounded-3xl shadow-2xl border border-gray-800 backdrop-blur-2xl">
                <div className="text-left text-gray-200 sm:w-2/3">
                    <h2 className="sm:text-4xl text-2xl font-extrabold tracking-tight mb-4 text-gray-100">
                        Search for the Role
                    </h2>
                    <p className="sm:text-lg text-sm text-gray-400">
                        Look up the role, company, and provide your Job ID to get started.
                    </p>
                </div>
                <div className="w-full sm:w-1/3">
                    <SearchAnimation />
                </div>
            </div>
            {/* Step 2: Scroll People */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl p-8 rounded-3xl shadow-2xl border border-gray-800 backdrop-blur-2xl">
                <div className="w-full sm:w-1/3">
                    <RequestAnimation />
                </div>
                <div className="text-left text-gray-200 sm:w-2/3">
                    <h2 className="sm:text-4xl text-2xl font-extrabold tracking-tight mb-4 text-gray-100">
                        Browse Employees
                    </h2>
                    <p className="sm:text-lg text-sm text-gray-400">
                        Scroll through a multitude of people currently in that role and company.
                    </p>
                </div>
            </div>
            {/* Step 3: Send Request */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl p-8 rounded-3xl shadow-2xl border border-gray-800 backdrop-blur-2xl">
                <div className="text-left text-gray-200 sm:w-2/3">
                    <h2 className="sm:text-4xl text-2xl font-extrabold tracking-tight mb-4 text-gray-100">
                        Request a Referral
                    </h2>
                    <p className="sm:text-lg text-sm text-gray-400">
                        Just tap the request button to ask for a referral. Employees approve.
                    </p>
                </div>
                <div className="w-full sm:w-1/3">
                    <SendRequestAnimation />
                </div>
            </div>
            {/* Step 4: Chat */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl p-8 rounded-3xl shadow-2xl border border-gray-800 backdrop-blur-2xl">
                <div className="w-full sm:w-1/3">
                    <ChatAnimation />
                </div>
                <div className="text-left text-gray-200 sm:w-2/3">
                    <h2 className="sm:text-4xl text-2xl font-extrabold tracking-tight mb-4 text-gray-100">
                        Instant Chat
                    </h2>
                    <p className="sm:text-lg text-sm text-gray-400">
                        Unsure? Feel like reaching out? Chat with Approving employees right on the website.
                    </p>
                </div>
            </div>
        </div>
    );
}