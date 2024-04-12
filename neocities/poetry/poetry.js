const poems = [
	{	name: "haiku he was cursed by an evil wizard to write",
		start: "apr 9, 2024", end: "apr 9, 2024",
		text: `
<i style="font-size: 0.875em">→ replying to: "sorry my american kicked in. ardenna is influencing me with dark auras"</i>
Meter is Commie's ❌
Eat ten-thousand cheeseburger ✅ 
Infinite Highway 🛣️
<i style="float: right">- ardenna</i>
		`,
	},
	{	name: "walled garden",
		start: "feb 8, 2024", end: "feb 9, 2024",
		text: `
the distant sun pulses
northern star, light dripping
glaring down in knotted fingers
burning paths on the ocean floor

where the spiraling undertow
cascades sand in concentric circles
layering sediment over sediment over stark bone
a skeleton with a missing rib
staring into an empty fridge
artificial light burning
eyes falling into falling
down fractalling glass shelves with
fingers clutched back the door
pressure pounding behind the eyes
snakes twisting into themselves into
gordian knots dropped through the floor
temptation with tail in the mouth
open carton of spoiled milk
bubbling hydrothermal vent
bite into dried apple
thick film of mold and rot
teeth to core coughing out
screamed apology
for bubbling apotheosis that never comes
blaring sunlight that never comes
i am stuck
caught in a beartrap, drowning in a walled garden
falling in stasis in endless abiogenesis
staring up at the sky, the planes passing by
staring into the sun from the ocean floor
		`
	},
	{	name: "dog",
		start: "may 11, 2023", end: "jan 25, 2024",
		text: `
Lights
dance dizzy through the brush
flit across the forest floor
cast by some vast disco ball

hanging high above the forest—
now alight with noise, tramping, screaming—
smiling pleasantly overhead
in the image of a benevolent protector

There is blood
frozen to the pavement
caught in black-and-white photograph
by police headlights

The spotlights swing around
a gunshot splits the blinding light
the wardrum pauses

a breath withheld
and released
a police dog bleeds into the dirt.



Cameras
beaming out of the skull
footage unsteady
battery low

a dive, feet first
a tumble, and up again
a burst through the bushes
you slept in last night

And the lights above the city laugh
here's to the soft panting
of a cornered animal
and here's to that terrified
convulsing heart

Engine jumpstart, searchlight disco
dancing on the strings of the violin
swollen eye, dead leg, limping
leaping into the moon's open mouth

as the world drapes itself in stark black and white
as the terror strikes with the bullet



Action!
Heaven explodes downward
the angels, their bright apparatus
in green canvas robes

There is blood frozen to the pavement
the news trucks come
they say sharks can smell blood
a quarter mile away

mill on the concrete, upturned ant colony
symphony of cacophany
sing in the cameras' mechanical flashes
oh, did you know the animal closely?

house of cards on baby blue tanks
insanity complex indivisibility
pour me a glass, choke me in halo
camaraderie epistemology

they say

sharks can smell blood a quarter of a mile away
captive blood pools a mile deep in the forest
		`
	},
	{	name: "an empty easel",
		start: "oct 30, 2023", end: "nov 6, 2023",
		text: `
yesterday, upon the stair
i met the girl that was not there
she watched me, like aged debris
as hoarsely she did not say to me:

the door to the bedroom hangs ajar
its steeple toppled to the earth
silence leaks out of the hole in the wall
and down the empty stairs

dust trickles like sand from the rafters
this house a parchment photograph
with a thousand gaping scorched holes
in all the places my hands should be

the grit catches between my fingers
in the moments i find myself solid again
tapping absently, endlessly
marking the time it's been since

the bathroom mirror has only reflected the empty wall
and a minute hand softly circling—
a vulture, above a head that is not there
against a blazing sun that burns the eyes

since my shadow, stretching into the desert sand
has followed me far too slow, a fading afterimage
trailing snapped pencils and crumpled notes
the silhouette of an absent girl

the wolf haunts this place
its shadow flits across the airless corridor
over the pages plastered to the plaster wall
i watch, mouth dry, eyes wet

until he breathes down the back of my neck
the trickling sand of a broken hourglass
its shards cover the floor of this place
a thousand biting funhouse mirrors

until he chokes my sight, him and that horrid sun
retinas burnt like an egg forgotten on the stove
he dances on the red strings cutting into the walls
legs unmoving, grin unnerving

he will stalk me into a red-string noose, i know
winding myself ever tighter on the glass-strewn floor
until my fingers bleed poetry onto the pen and paper
until the sand chokes my lungs in coughing fits

i will scream and the musty air will cloy my tongue
breath close against the sarcophagus slab
hands still straining, tapping, scratching
from the inside of an empty grave
		`
	},
	{	name: "recursive space",
		start: "oct 17, 2023", end: "oct 27, 2023",
		text: `
the rain ran down the painted sky
like the inside of a car window
and the world warped and tore
as i watched it whistle by

and the clouds bled wetly down to earth
and blood hung from her hands
catching the light like little gems
they painted my tears a crimson red

and the paint dripped off the walls
the graffiti and the fresco
the city was aflood that night
or was it bleeding dry?

and the flood shook the snowglobe walls
smeared with blood and paint
and i cried as the car drove on
and drowned myself alive
		`
	},
	{	name: "like all her little cranes, she's all folded too",
		start: "aug 21, 2023", end: "oct 27, 2023",
		text: `
they say that every evening
she leans out of her window
watching the foaming sky
and the seagulls, flying home

and when they disappear, one by one
she sits by her desk, lights a lamp
and out of her sorrows crafts
a little paper crane

they hang on high like stars
and plate the floor like shells
white, and blue, and red, and green
her room, her little paradise

and every morning, groggy,
she takes out a pair of scissors
and cuts every poor little crane
to shreds.

her scissors glide
through the rough paper
and like a wingtip catches foam
bathes itself in blood

and she stops, alarmed
the blades resting just before
something
she pretends not to notice
		`
	}
]


const buttonLeft = document.getElementById("prev");
const buttonRight = document.getElementById("next");
var page = 1;

async function leafTo(idx) {
	idx = (idx - 1) * 2;
	write(poems[idx], "left");
	if (idx + 1 != poems.length) write(poems[idx + 1], "right");
	else document.getElementById("right").textContent = "";

	buttonLeft.disabled = idx == 0;
	buttonRight.disabled = idx + 2 >= poems.length;

	function write(poem, side) {
		document.getElementById(side).innerHTML = `
			<h2>${poem.name}</h2>
			<div class="date start">bgn. ${poem.start ?? "███████ ████"}</div>
			<div class="date end">pub. ${poem.end}</div>
			<pre>${poem.text.trim()}</pre>
		`;
	}
}

leafTo(page);
buttonLeft.onclick = () => leafTo(--page);
buttonRight.onclick = () => leafTo(++page);