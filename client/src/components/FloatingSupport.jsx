import { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaComments,
  FaTimes,
} from "react-icons/fa";
import api from "../services/api";

function FloatingSupport() {
  const [open, setOpen] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");

  useEffect(() => {

    // Public endpoint, no auth needed — pulls whatever email is set
    // in Admin Settings instead of a hardcoded address, so changing
    // it later is just an admin panel edit, not a code change.
    api.get("/settings/public")
      .then((response) => {
        setSupportEmail(response.data.settings?.support_email || "");
      })
      .catch((error) => {
        console.log("LOAD PUBLIC SETTINGS ERROR:", error);
      });

  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">

      {open && (
        <div className="mb-4 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">

          <div className="bg-blue-600 text-white px-5 py-4 flex justify-between items-center">

            <h2 className="font-bold">
              SwiftTopUp Support
            </h2>

            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>

          </div>

          <div className="p-4 space-y-3">

            <a
              href="https://wa.me/2347046594823"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50"
            >
              <FaWhatsapp className="text-green-600 text-2xl" />
              <div>
                <h3 className="font-semibold">
                  WhatsApp 1
                </h3>
                <p className="text-sm text-gray-500">
                  07046594823
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/2348055684139"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50"
            >
              <FaWhatsapp className="text-green-600 text-2xl" />
              <div>
                <h3 className="font-semibold">
                  WhatsApp 2
                </h3>
                <p className="text-sm text-gray-500">
                  08055684139
                </p>
              </div>
            </a>

            <a
              href="tel:09168983323"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50"
            >
              <FaPhoneAlt className="text-orange-500 text-xl" />
              <div>
                <h3 className="font-semibold">
                  Call Support
                </h3>
                <p className="text-sm text-gray-500">
                  09168983323
                </p>
              </div>
            </a>

            {supportEmail && (
              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50"
              >
                <FaEnvelope className="text-blue-600 text-xl" />
                <div>
                  <h3 className="font-semibold">
                    Email Support
                  </h3>
                  <p className="text-sm text-gray-500">
                    {supportEmail}
                  </p>
                </div>
              </a>
            )}

          </div>

        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center animate-bounce"
      >
        <FaComments className="text-2xl" />
      </button>

    </div>
  );
}

export default FloatingSupport;