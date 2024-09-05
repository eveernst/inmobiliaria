// // pages/property/[id].tsx

// import { useRouter } from 'next/router';
// import { GetServerSideProps } from 'next';

// interface PropertyDetailProps {
//   property: {
//     id: string;
//     name: string;
//     description: string;
//   };
// }

// const PropertyDetail = ({ property }: PropertyDetailProps) => {
//   const router = useRouter();

//   if (router.isFallback) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>{property.name}</h1>
//       <p>{property.description}</p>
//     </div>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.params!;
  
//   // Simular la obtención de datos (puedes conectarlo a una API o base de datos real)
//   const property = {
//     id,
//     name: `Propiedad ${id}`,
//     description: `Descripción de la propiedad ${id}`,
//   };

//   return {
//     props: {
//       property,
//     },
//   };
// };

// export default PropertyDetail;
