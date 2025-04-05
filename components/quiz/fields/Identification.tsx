import React from "react";
import { Textarea } from "../../../components/ui/textarea";
import {Button} from "../../../components/ui/button";
const Identification = () => {
   return <div className="z-10 w-full flex flex-col justify-center items-center gap-4">
        <Textarea className="bg-[#D3DDFD] border-2 border-[#31384D] w-full md:w-3/4 lg:w-1/2 h-20" placeholder="Type your answer here..."  />
        <Button className="bg-[#576EB6] w-full md:w-3/4 lg:w-1/2">Submit</Button>
    </div> 
}

export default Identification;