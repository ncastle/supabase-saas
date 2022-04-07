import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const LessonDetails = ({ lesson }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from('premium_content')
      .select('video_url')
      .eq('id', lesson.id)
      .single();
    console.log({ data });

    setVideoUrl(data?.video_url);
  };

  useEffect(() => {
    getPremiumContent();
  }, []);

  return (
    <div className='mx-auto w-full max-w-3xl py-16 px-8'>
      <h1 className='mb-6 text-3xl'>{lesson.title || 'No title'}</h1>
      <p>{lesson.description || 'No description'}</p>
      {!!videoUrl && <p>{videoUrl}</p>}
    </div>
  );
};

export default LessonDetails;

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from('lesson').select('id');

  const paths = lessons.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const { data: lesson } = await supabase
    .from('lesson')
    .select('*')
    .eq('id', id)
    .single();

  return {
    props: { lesson },
  };
};
