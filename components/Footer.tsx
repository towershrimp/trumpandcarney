"use client"
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 p-4 text-white text-center">
      <div>
        &copy; <Link href="https://4rest-maker.tistory.com/">OpenPEN</Link>
        <span className="ml-4">
         <Link href="https://x.com/TowerShrimp">Twitter</Link>
       </span>
      </div>
     </footer>
    );
   }

