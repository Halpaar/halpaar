// Tag coloring
const tag_to_chip_color_map = {
    "common": "brown",
    "dooley": "silver",
    "jules": "pink",
    "mak": "red",
    "pygmalien": "yellow",
    "stelle": "yellow",
    "vanessa": "red",
}

export function chip_tag_color(tag) {
    if (tag.toLowerCase() in tag_to_chip_color_map)
        return tag_to_chip_color_map[tag.toLowerCase()]

    return "grey"
}