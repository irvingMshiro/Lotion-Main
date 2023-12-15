import Image from "next/image";

export const Heroes = () =>{
    return(
        <div className="flex flex-col items-center justify-center max-w-5xl
            relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] 
            md:w-[400px] mx-auto"
        >
            <Image
                src="/landing-page.png"
                fill
                className="object-contain dark:hidden"
                alt="lpage"/>
            <Image 
                src="/landing-page-dark.png"
                fill
                className="object-contain hidden dark:block"
                alt="lpage"/>
        </div>
    )
}