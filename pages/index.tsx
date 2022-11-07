import Auth from './components/Auth/Auth';

export type RootPageProps = {
  redirect_reason: string;
};

export default function Home(props: RootPageProps) {
  return <Auth {...props} />;
}
