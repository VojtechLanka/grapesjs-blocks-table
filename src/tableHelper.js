export function insertColumn(tableComponent, addAtIndex, updateProps = false){
    tableComponent.components().forEach((component, index) => {
        if(index === 0 && tableComponent.props().hasHeaders) {
            component.components().add({ type: 'th' }, {at: addAtIndex});
        } else {
            component.components().add({ type: 'cell' }, {at: addAtIndex});
        }
    });

    if(updateProps){
        tableComponent.set({nColumns: Number(tableComponent.props().nColumns) + 1})
    }
}

export function insertRow(tableComponent, addAtIndex, updateProps = false){

    tableComponent.components().add({
        type: 'row',
        components: [...Array(tableComponent.components().at(0).components().length).keys()].map(() => ({ type: 'cell' }))
    }, {
        at: addAtIndex
    });

    if(updateProps){
        tableComponent.set({nRows: Number(tableComponent.props().nRows) + 1})
    }
}

export function removeColumn(tableComponent, removeAtIndex, updateProps = false) {
    tableComponent.components().forEach(component => {
        component.components().at(removeAtIndex).remove();
      });
    if(updateProps){
        tableComponent.set({nColumns: Number(tableComponent.props().nColumns) - 1})
    }
}


export function removeRow(tableComponent, removeAtIndex, updateProps = false) {
    tableComponent.components().at(removeAtIndex).remove()
    if(updateProps){
        tableComponent.set({nRows: Number(tableComponent.props().nRows) - 1})
    }
}

export function toggleHeaderRow(tableComponent, updateProps = false){
    let toggleOn = updateProps == false? tableComponent.props().hasHeaders: !tableComponent.props().hasHeaders;
    if(toggleOn) {
        console.log("Adding th as per passed prop")
        let headers = [];
        for (let index = 0; index < tableComponent.props().nColumns; index++) {
        headers.push({ type: 'th' });
        }
        tableComponent.components().add({ type: 'row', components: headers }, { at: 0 });
    } else {
        console.log("removing th as per passed prop")
        tableComponent.components().at(0).remove()
    }
    if(updateProps){
        tableComponent.set({hasHeaders: toggleOn})
    }
}