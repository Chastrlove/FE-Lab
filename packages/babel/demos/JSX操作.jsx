function ExampleComponent(props) {
    const { isAdmin, dataSource } = props;

    return (
        <>
            <div x-if={isAdmin}>admin</div>
            <div x-else>guest</div>

            <div x-for={item in dataSource}>
                <span>{item.name}</span>
            </div>
        </>
    );
}
