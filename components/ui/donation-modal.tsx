'use client'

import React, { useState } from 'react';
import { X, Copy, ExternalLink } from 'lucide-react';
import { Button } from './button';


interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [copiedUPI, setCopiedUPI] = useState(false);
  
  const upiId = 'arijitdubey2018@okhdfcbank';
  
  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    } catch (err) {
      console.error('Failed to copy UPI ID');
    }
  };

  const openGooglePay = () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=Arijit Dubey&cu=INR&tn=Support Reffer Platform`;
    window.location.href = upiUrl;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Support Reffer ❤️</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Your support helps keep this platform running and free for everyone! <br/>(Trust me I'm broke T_T)
          </p>

          {/* UPI ID */}
          <div className="bg-gray-800 rounded-lg p-4">
            <label className="text-sm text-gray-400 block mb-2">UPI ID</label>
            <div className="flex items-center gap-2">
              <code className="text-white bg-gray-700 px-3 py-1 rounded flex-1 text-sm">
                {upiId}
              </code>
              <Button
                onClick={copyUPI}
                size="sm"
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <Button
              onClick={openGooglePay}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Google Pay
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Or scan the QR code with any UPI app
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg mx-auto w-fit">
            <img 
              src="/qr_code.jpg" 
              alt="UPI QR Code for donations" 
              className="w-48 h-48 object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}