Grabnslide is a light javascript librairy to activate a dragable slider on a bloc. You can see a quick demo [here](http://lab.ivandaum.fr/Grabnslide.js/example/)

# Use

```javascript

  new Grabnslide({
    container: document.querySelector('ul'),
    cell: document.querySelectorAll('ul li')
  })

```
When grabbing the slider, a `dragging` class is added to your `body`.
# Options

`container` : the draggued block

`cell`: the cell inside the block. The lib will add all width and use to set the limit of the draggable parts.

`triggerElement` : the clicked block. It's different from the `container`, understand that the container _will be draggued_ and the `triggerElement` _will receive the user's mouse drag action_
