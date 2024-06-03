

type Props = {
  onClick:any
  title:string
  type:string
  textcolor:string
}

function Button({onClick,title,type,textcolor}: Props) {
  if(type==="outline"){
    return (
      <div onClick={onClick} className={`text-${textcolor} z-50 border-[1px] text-center border-gray-300 rounded-md md:translate-x-0 translate-x-2 p-2 font-medium cursor-pointer md:text-lg text-sm w-full `}>{title}</div>
    )
  }if(type==='normal'){
      return (
    <div onClick={onClick} className="bg-red-500 text-center z-50  rounded-md p-2 font-medium text-white cursor-pointer text-lg">{title}</div>

  )
  }

}

export default Button