import useSWR from 'swr';
import Image from 'next/image';

export default function SpotifyPlayingNow() {
   const fetcher = (url) => fetch(url).then((r) => r.json());
   const { data } = useSWR('/api/spotify', fetcher);
   return (
     <>
      <section className='bg-gray-600'>
        <main className='flex items-center justify-center'>
           {console.log(data?.ai)}
           {/* <img src={data?.ai}></img> */}
            <Image src= {data?.ai}
                    width={300}
                    height={300}
                    alt='Album image'
                    ></Image>
           <h1>{data?.artist}</h1>
           <h1>{data?.title}</h1>

         </main>
      </section>
    </>
  );
}

// export default function spotify() {

//     return <><p> aqui va a ir spotify api cuando funcione </p></>

// }