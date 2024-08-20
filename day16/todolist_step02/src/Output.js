import ItemRow from "./ItemRow";

const Output = ({todoList, onDoneFlag, onDelete, onEdit}) => {
    return (
        <div className="list-body">
          <div className="container">
          <table className="table table-hover">
            <thead>
                <tr style={{textAlign:"center"}}>
                    <th>Done</th>
                    <th>Title</th>
                    <th>Buttons</th>
                </tr>
                </thead>
                <tbody>
                {todoList.map((item)=> {
                    return(<tr key={item.no}>
                        <td colSpan={3} style={{padding:"0px"}}>
                            <ItemRow item={item} onDoneFlag={onDoneFlag} onDelete={onDelete} onEdit={onEdit} />
                        </td>
                    </tr>)
                })}
                </tbody>
            </table>
          </div>
        </div>
    );
}

export default Output;