import { useState } from 'react'

const CustomHook = () => {

    const [expanded, setExpanded] = useState(false);

    return {
        expanded, 
        setExpanded
    }
}

export { CustomHook }