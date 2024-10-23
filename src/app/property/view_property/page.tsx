import Header from "@/components/header";
import Dropezone from "@/components/dropzone";

export default function SeeProperty() {
    return (
        <main>
            <Header />
            <h1>PROPIEDADES</h1>
            <p>En esta página podrás ver las propiedades que tenemos disponibles</p>
            <Dropezone />
        </main>
    );
}