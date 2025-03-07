"use client";
import AddBotModal from "@/components/AddBotModal";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TfiSave } from "react-icons/tfi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { RootState, useAppSelector } from "@/lib/store";
import axios from "axios";
import { FaPersonRifle, FaUser } from "react-icons/fa6";
import { logIn, Roles } from "@/lib/features/user/userSlice";
import { useDispatch } from "react-redux";
import { MainURL } from "../../URLS";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useAppSelector((state: RootState) => state.user.value);
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("addBot"); // Удаляем параметр addBot

    router.replace(`/?${params.toString()}`, { scroll: false });
  };
  const getUser = async () => {
    const response = await axios.get(`${MainURL}/user`, {
      withCredentials: true,
    });
    dispatch(logIn(response.data));
    console.log(user);
  };

  const [username, setUsername] = useState("");
  const [streamer, setStreamer] = useState("");
  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const [message, setMessage] = useState("");
  const [streamerId, setStreamerId] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    fetchBroadcasterId(username.trim());
    e.preventDefault();
    setStreamer(username.trim());
    toast.success("Стример успешно добавлен");
  };
  const searchParams = useSearchParams();

  const show = searchParams.get("addBot");

  const sendMessage = async () => {
    if (!message.trim()) return;

    const res = await fetch("https://api.twitch.tv/helix/chat/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${selectedBot?.access_token}`,
        "Client-Id": "gp762nuuoqcoxypju8c569th9wz7q5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        broadcaster_id: streamerId,
        sender_id: selectedBot?.id,
        message: message,
      }),
    });

    if (res.ok) {
      toast.success("Сообщение отправлено!");
      setMessage("");
    } else {
      toast.error("Ошибка отправки сообщения");
    }
  };

  const fetchBroadcasterId = async (streamerName: string) => {
    console.log(selectedBot);
    const res = await fetch(
      `https://api.twitch.tv/helix/users?login=${streamerName}`,
      {
        headers: {
          Authorization: `Bearer ${selectedBot?.access_token}`,
          "Client-Id": "gp762nuuoqcoxypju8c569th9wz7q5",
        },
      }
    );

    const data = await res.json();
    console.log(data);
    setStreamerId(data?.data[0]?.id);
    return data?.data[0]?.id; // Вернёт broadcaster_id
  };

  const handleAddBot = (data) => {
    if (!bots.find((bot) => bot.id === data.id)) {
      setBots([...bots, data]);
      closeModal();
    } else {
      closeModal();
      toast.error("Бот уже добавлен");
    }
    console.log(data);
  };

  const selectBot = (bot) => {
    setSelectedBot(bot);
  };

  // const followUser = async () => {
  //   const response = await fetch("https://gql.twitch.tv/gql", {
  //     method: "POST",
  //     headers: {
  //       "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5",
  //       Authorization: `Bearer ${selectedBot?.access_token}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       from_id: selectedBot?.id, // ID пользователя, который подписывается
  //       to_id: streamerId, // ID пользователя, на которого подписываемся
  //     }),
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(`Ошибка подписки: ${error.message}`);
  //   }

  //   return await response.json();
  // };

  async function followUser() {
    const url = "https://gql.twitch.tv/gql";

    const payload = [
      {
        operationName: "FollowButton_FollowUser",
        variables: {
          input: {
            disableNotifications: false,
            targetID: streamerId,
          },
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08",
          },
        },
      },
    ];

    console.log(selectedBot);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 7sobnpzmxenmq0bkt8c8h9k0ly3n06`, // Важно передать OAuth-токен авторизованного пользователя
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko  ", // Иногда нужен Client-ID
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ошибка Twitch API: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    getUser().then(() => {
      if (user.role.length === 1 && user.role.includes(Roles.USER)) {
        router.push("/auth");
      }
    });
  }, []);

  return (
    <div className="p-10 flex flex-col ">
      <div className="flex flex-row ">
        <div className="flex flex-col  w-[20vw] items-center gap-2">
          <span className="font-bold text-xl" onClick={() => followUser()}>
            Ник стримера
          </span>
          <form onSubmit={handleSubmit} className="flex flex-row items-center">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ник стримера"
              className="bg-[#584e61] p-2 rounded-md"
            />
            <button type="submit" className="ml-3">
              <TfiSave
                size={28}
                className="hover:cursor-pointer"
                color="#8840c9"
              />
            </button>
          </form>
        </div>
        {user && user?.role.includes("ADMIN") && (
          <div className="items-center mr-32 hover:cursor-pointer flex w-full justify-center">
            <FaUser size={35} />
          </div>
        )}
      </div>
      <div className="relative w-full mt-4">
        <div className="absolute top-0 left-0 w-full h-[0.1px] bg-[#584e61]"></div>
      </div>{" "}
      <div className="flex flex-row  mt-5 ">
        <div className="bg-[#584e61] w-fit p-4 rounded-lg inline-flex flex-col justify-between">
          <div className=" flex flex-col w-[20vw] items-center justify-center ">
            <span className="font-bold text-xl mt-3 ">Выбранный бот</span>
            <span className="font-bold text-xl mt-3">
              {selectedBot?.display_name}
            </span>
            <div></div>
            <div>
              <Link href="/?addBot=true">
                <button className="p-3 font-semibold bg-main mt-3 rounded-lg ">
                  Добавить бота
                </button>
              </Link>
            </div>
            <div></div>
          </div>
          <div className="mt-5 flex flex-col w-[20vw]  items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="bg-[#2a252f] p-2 rounded-md w-[19vw]"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-main rounded-md text-white"
            >
              Отправить сообщение
            </button>
          </div>
        </div>
        {show && <AddBotModal onAddBot={handleAddBot} />}
        <div className="ml-10 bg-[#584e61] min-w-[20vw] flex items-center  flex-col  p-4 rounded-lg">
          <span className="font-bold text-xl mt-3">Боты</span>
          <ul className="list-disc pl-5 mt-4 gap-2 flex flex-col">
            {bots.map((bot, index) => (
              <li
                onClick={() => selectBot(bot)}
                key={index}
                className="mt-2 border p-2 rounded-lg hover:cursor-pointer"
                style={{
                  backgroundColor:
                    selectedBot?.id === bot.id ? "#8840c9" : "#584e61",
                }}
              >
                {bot.display_name}
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="ml-10 bg-[#584e61] w-fit p-4 rounded-lg inline-flex flex-col items-center">
          <span className="font-bold text-xl mt-3">Подписки</span>
          <div className="flex flex-col items-center justify-center gap-2 mt-3">
            <span className="text-lg ">Канал</span>
            <input
              className="bg-[#2a252f] p-2 rounded-md w-[19vw]"
              placeholder="Введите канал"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-3">
            <span className="text-lg ">Введите интервал (в секундах)</span>
            <input
              className="bg-[#2a252f] p-2 rounded-md w-[19vw]"
              placeholder="Введите интервал"
            />
          </div>
          <div>
            <span className="text-lg ">Введите кол-во подписок</span>
            <input
              className="bg-[#2a252f] p-2 rounded-md w-[19vw]"
              placeholder="Введите кол-во подписок"
            />
          </div>
        </div> */}
      </div>
      <div className="flex flex-row justify-end fixed top-5 right-0">
        <div className="inline-flex ">
          {streamer && (
            <div>
              <iframe
                src={`https://player.twitch.tv/?channel=${streamer}&parent=http://debrabebra.top/`}
                height="170"
                width="350"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg rounded-b-none shadow-lg"
              ></iframe>
              <iframe
                src={`https://player.twitch.tv/?channel=${streamer}&parent=http://debrabebra.top/`}
                height="500"
                width="350"
                frameBorder="0"
                className="rounded-lg rounded-t-none shadow-lg "
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
