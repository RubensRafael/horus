import { useSession } from 'next-auth/react';

const Home = () => {
  const { data, status } = useSession();
  return <div>{data?.user?.name}</div>;
};

export default Home;
