"use client";

import { logIn } from "@/lib/features/user/userSlice";
import { RootState, useAppSelector } from "@/lib/store";
import { UserIF } from "@/types/userType";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Auth() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  enum AuthModes {
    REGISTRER = "register",
    LOGIN = "login",
  }

  const onSubmit = async (data: any) => {
    async function regiter() {
      await axios.post("http://localhost:4444/register", data, {
        withCredentials: true,
      });
      toast.success("Регистрация прошла успешно!");
      router.push("/pending");
    }
    async function login() {
      const response = await axios.post("http://localhost:4444/login", data, {
        withCredentials: true,
      });
      const user: UserIF = response.data;
      console.log(user);
      dispatch(logIn(user));
      toast.success("Успешный вход!");
      // router.push("/pending");
    }
    try {
      if (selectedAuthMode === AuthModes.REGISTRER) {
        await regiter();
      } else {
        await login();
      }
    } catch (error) {
      console.error(error);
      if (selectedAuthMode === AuthModes.LOGIN) {
        toast.error("Ошибка входа");
      } else {
        toast.error("Ошибка регистрации");
      }
    }
  };
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [selectedAuthMode, setSelectedAuthMode] = useState<AuthModes>(
    AuthModes.REGISTRER
  );
  return (
    <div className="h-[100vh] flex flex-col gap-4 items-center justify-center  ">
      <h1 className="text-4xl font-bold text-white mb-4">
        {selectedAuthMode === AuthModes.REGISTRER ? "Регистрация" : "Вход"}
      </h1>

      <form
        className="flex flex-col p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("login", { required: "Логин обязательно" })}
          type="text"
          placeholder="Введите логин"
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <div className="mb-4 p-2 border flex flex-row items-center border-gray-300 rounded">
          <input
            {...register("password", { required: "Пароль обязательно" })}
            type={isPasswordShow ? "text" : "password"}
            placeholder="Введите пароль"
            className=""
          />
          {isPasswordShow ? (
            <IoEyeOff
              size={20}
              className="hover:cursor-pointer"
              onClick={() => setIsPasswordShow(false)}
            />
          ) : (
            <IoEye
              size={20}
              className="hover:cursor-pointer"
              onClick={() => setIsPasswordShow(true)}
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-main text-white p-2 rounded shadow-2xl hover:bg-mainactive"
        >
          {selectedAuthMode === AuthModes.REGISTRER
            ? "Зарегистрироваться"
            : "Войти"}
        </button>
      </form>
      <div>
        {selectedAuthMode === AuthModes.REGISTRER ? (
          <button
            onClick={() => setSelectedAuthMode(AuthModes.LOGIN)}
            className="bg-background hover:bg-backgroundactive shadow-lg p-2 rounded-lg "
          >
            Или войти
          </button>
        ) : (
          <button
            onClick={() => setSelectedAuthMode(AuthModes.REGISTRER)}
            className="bg-background hover:bg-backgroundactive shadow-lg p-2 rounded-lg "
          >
            Или зарегистрироваться
          </button>
        )}
      </div>
    </div>
  );
}
