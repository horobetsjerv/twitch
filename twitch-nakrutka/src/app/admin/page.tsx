"use client";

import { Roles } from "@/lib/features/user/userSlice";
import { UserIF } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { MainURL } from "../../../URLS";

export default function Auth() {
  const [users, setUsers] = useState<UserIF[]>([]);
  const [usersRequests, setUsersRequests] = useState<UserIF[] | []>([]);
  const [usersWorkers, setUsersWorkers] = useState<UserIF[] | []>([]);

  async function deleteWorker(id: string) {
    await axios.patch(
      `${MainURL}/deleteRoleWorker`,
      { id },
      { withCredentials: true }
    );
  }

  async function getUsers() {
    const users = await axios.get(`${MainURL}/users`);

    setUsers(users.data.users);
    return users;
  }

  async function addWorker(id: string) {
    const response = await axios.patch(`${MainURL}/addRoleWorker`, {
      userId: id,
    });
    return response;
  }

  useEffect(() => {
    if (users.length > 0) {
      const requests = users.filter(
        (user) => user.role.length === 1 && user.role.includes(Roles.USER)
      );
      const workers = users.filter((user) => user.role.includes(Roles.WORKER));
      setUsersRequests(requests);
      setUsersWorkers(workers);
      console.log(requests, workers);
    }
  }, [users]);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="flex flex-row">
      <div className="w-[25vw] border-r-2 h-auto">
        <div className="flex flex-col  items-center mt-8 w-[25vw]">
          <span className="text-2xl font-bold bg-[#8840c9] text-white rounded-xl p-2">
            ШТАТ
          </span>
          <div className="mt-4 flex  flex-col gap-4">
            {usersWorkers.map((user) => (
              <div className="flex flex-row items-center gap-3 justify-between">
                <span className="w-[17vw] flex items-center justify-center text-lg rounded-md border p-2 hover:cursor-pointer">
                  {user.login}
                </span>
                <FaHeart
                  size={30}
                  color="#8840c9"
                  onClick={() => deleteWorker(user.id)}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
          <span className="text-2xl font-bold mt-4">Запросы</span>
          <div className="">
            {usersRequests.map((user) => (
              <div className="flex flex-row items-center gap-2">
                <span className="w-[17vw] flex items-center justify-center text-lg rounded-md border p-2 hover:cursor-pointer mt-2">
                  {user.login}
                </span>
                <div className="flex flex-row gap-2">
                  <IoCheckmarkCircle
                    onClick={() => addWorker(user.id)}
                    className="hover:cursor-pointer"
                    size={30}
                  />
                  <MdCancel className="hover:cursor-pointer" size={30} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-9 font-bold text-3xl w-full justify-center flex ">
        <h1>Статистика</h1>
      </div>
    </div>
  );
}
