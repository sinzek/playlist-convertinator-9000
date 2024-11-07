import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
    if(isRouteErrorResponse(error)) {
        console.error(error);

        return (
            <>
                <section>
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                        <div className="mx-auto max-w-screen-sm text-center">
                            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                                404
                            </h1>
                            <p className="mb-4 text-3xl tracking-tight font-bold text-primary-500 md:text-4xl dark:text-white">
                                This URL does not exist. Try returning to the Homepage.
                            </p>
                            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                                {" "}
                                <i>{error.statusText || error.message}</i>{" "}
                            </p>
                            <a
                                href="/"
                                className="inline-flex bg-primary text-primary-content focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                            >
                                Back to Homepage
                            </a>
                        </div>
                    </div>
                </section>
            </>
        );
    } else {
        return (
            <>
                <section>
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                        <div className="mx-auto max-w-screen-sm text-center">
                            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                                401
                            </h1>
                            <p className="mb-4 text-3xl tracking-tight font-bold text-primary-500 md:text-4xl dark:text-white">
                                You are unauthorized. Try returning to the Homepage.
                            </p>
                            <a
                                href="/"
                                className="inline-flex bg-primary text-primary-content focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                            >
                                Back to Homepage
                            </a>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
