const AddRemoveButton = ({handle, interior}) => {
  return(
    <button
    onClick={(e) => {
        e.stopPropagation(); // Evitar que el clic cierre el popup
        handle();
    }}
>
    {interior}
</button>
  )
}

export { AddRemoveButton }