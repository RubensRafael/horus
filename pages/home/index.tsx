import { useSession } from 'next-auth/react';

const Home = () => {
  const { data, status } = useSession();
  console.log({ data, status });
  return <div>{data?.user?.name}</div>;
};

export default Home;
