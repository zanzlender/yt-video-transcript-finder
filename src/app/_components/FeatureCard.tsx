type FeatureCardProps = {
  title: string;
  text: string;
  Icon: React.ReactNode;
};

const FeatureCard = ({ title, text, Icon }: FeatureCardProps) => {
  return (
    <div className="block select-none rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/30 hover:shadow-pink-500/30">
      {Icon}

      <h2 className="mb-2 mt-4 text-xl font-bold text-white">{title}</h2>

      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
};
export default FeatureCard;
