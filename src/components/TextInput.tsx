type TextInputProps = {
  title: string;
  value: string;
  setValue: (s: string) => void;
  type?: string;
  name: string;
};

export default function TextInput(Props: TextInputProps) {
  const { title, value, setValue, type, name } = Props;

  return (
    <div className="h-10 w-96 rounded-lg border-2 border-purple-300">
      <label
        htmlFor={name}
        className="relative bottom-3.5 right-8 z-20 ml-12 text-purple-300 bg-black"
      >
        {title}
      </label>
      <input
        type={type}
        id="name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="relative bottom-1text-lg h-11/12 relative bottom-4 w-full bg-transparent pl-2 text-white focus:outline-none m-auto"
      />
    </div>
  );
}
