import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("../components/App"), {
  ssr: false,
});

function HomePage() {
  return (
    <div>
      <DynamicComponentWithNoSSR />
    </div>
  );
}

export default HomePage;
