import Header from "@/components/header";

export default function new_property() {
    return (
        <main>
            <Header />
            <h1>Nueva Documentacion</h1>
            <form className="max-w-sm mx-auto">
                <label htmlFor="name-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Nombre de la Escritura:</label>
                <input type="text" id="name-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Escritura" required />
            </form>
            <form className="max-w-sm mx-auto">
                <label htmlFor="number-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Numero de Escritura:</label>
                <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Numero de Escritura" required />
            </form>

        </main>
    );
}