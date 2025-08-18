export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <button className={`m-2 pointer rounded-full border p-2 bg-black hover:bg-white hover:text-black ${activated ? "text-red-400" : "text-white"}`} onClick={onClick}>
      {icon}
    </button>
  );
}
