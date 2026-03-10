import ResourceCard from "@/components/ResourceCard"

async function getResources(){

 const res = await fetch("http://localhost:3000/api/resources")

 return res.json()

}

export default async function Dashboard(){

 const resources = await getResources()

 return(

  <div className="p-10 grid grid-cols-3 gap-6">

   {resources.map((resource:any)=>(
    <ResourceCard key={resource.id} resource={resource} />
   ))}

  </div>

 )

}