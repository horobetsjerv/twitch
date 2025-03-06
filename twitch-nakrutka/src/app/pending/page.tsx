export default function Pending() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-background p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Запрос отправлен</h1>
        <p className="text-gray-200">Ваш запрос был отправлен Администратору</p>
      </div>
    </div>
  );
}
