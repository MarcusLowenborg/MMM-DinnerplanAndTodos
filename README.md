# MMM-DinnerplanAndTodos

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Display a lunch and dinner planner for the week and a simple Todo list.
Both parts are managed by a GUI on http://<Raspberry Pi ip-adress>

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-DinnerplanAndTodos',
			position: "top_left",
			header: "",
            config: {
                adminGuiPort: 80
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `option1`        | *Required* DESCRIPTION HERE
| `option2`        | *Optional* DESCRIPTION HERE TOO <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
