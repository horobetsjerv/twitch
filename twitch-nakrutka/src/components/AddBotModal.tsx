"use client";
import Link from "next/link";
import React, { useState } from "react";
import { createPortal } from "react-dom";

const AddBotModal = ({ onAddBot }) => {
  const [botToken, setBotToken] = useState("");

  const handleAddBot = async () => {
    const res = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${botToken}`,
        "Client-Id": "gp762nuuoqcoxypju8c569th9wz7q5",
      },
    });

    const data = await res.json();
    onAddBot({ ...data?.data[0], access_token: botToken });
    return data?.data[0];
  };
  return createPortal(
    <div
      id="modal"
      className="fixed inset-0 bg-black opacity-90 overflow-y-hidden h-full w-full flex items-center justify-center overflow-hidden"
    >
      <div className="p-8 w-[35vw] shadow-lg rounded-md bg-[#584e61] ">
        <div className="text-center">
          <h3 className="text-2xl font-bold ">Добавить бота</h3>
          <div className="mt-2 px-7 py-3">
            <div onSubmit={handleAddBot} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Введите токен бота"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="p-2 border mt-4 w-full"
              />
              <button
                onClick={handleAddBot}
                className="flex items-center justify-center gap-2 bg-[#8840c9] text-white p-2 rounded-md mt-2"
              >
                Добавить Бота
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Link
              href="/"
              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Закрыть
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddBotModal;
