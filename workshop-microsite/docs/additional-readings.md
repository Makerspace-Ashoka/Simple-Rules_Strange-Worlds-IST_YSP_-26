---
title: "Additional Readings"
sidebar_position: 11
sidebar_label: "Additional Readings"
---

# Additional Readings

If you want to keep exploring after the workshop, here is a reading and watching list that connects programming, computation, biology, slime moulds, sandpiles, and forest fire models.

## Programming

- Videos by Yesi

## Information on Cellular Automata

- [Cellular Automata, The Nature of Code](https://natureofcode.com/book/chapter-7-cellular-automata/)
- *A Textbook on Automata Theory* by P. K. Srimani and Nasir S. F. B.
- *Theory of Computation* by G. P. Saradhi Varma and B. Thirupathi Rao

## Biological Applications

- [11.5: Examples of Biological Cellular Automata Models - Mathematics LibreTexts](https://math.libretexts.org/Bookshelves/Scientific_Computing_Simulations_and_Modeling/Introduction_to_the_Modeling_and_Analysis_of_Complex_Systems_(Sayama)/11%3A_Cellular_Automata_I__Modeling/11.05%3A_Examples_of_Biological_Cellular_Automata_Models)
- [Coding "Predator And Prey" Cellular Automaton in C++ / SFML](https://youtu.be/v7Z2euv7kwY?si=NpRBK9Kg_HxNNASz)
- [Modeling Living Cells Within Microfluidic Systems Using Cellular Automata Models](https://doi.org/10.1038/s41598-019-51494-1)

## Other Applied Cellular Automata Models

- [Modelling earthquake activity features using cellular automata](https://doi.org/10.1016/j.mcm.2006.12.029)


## Slime Moulds

<details>
<summary><strong>Slime Mould and Cellular Automata</strong></summary>

<p><strong>No Brain. Still Solving Mazes.</strong></p>

<p><em>Physarum polycephalum</em> is a single-celled slime mould with no brain, no nerves, and no boss cell.</p>

<p>Yet it solves mazes, finds short paths to food, and builds efficient networks.</p>

<p>Suspiciously clever for a blob.</p>

<p>It behaves like a cellular automaton because each part only reacts to nearby chemical signals, just like CA cells update using only their neighbours.</p>

<p>No full map.<br />
No central control.<br />
Just local rules creating smart-looking behaviour.</p>

<p><strong>CA Mapping</strong></p>

<ul>
  <li>Empty -&gt; free space</li>
  <li>Slime -&gt; active slime mould</li>
  <li>Food -&gt; nutrient source</li>
  <li>Wall -&gt; blocked space</li>
  <li>Pheromone -&gt; fading slime trail</li>
</ul>

<p>The slime moves toward stronger food signals, leaves trails, abandons weak paths, and keeps the useful ones.</p>

<p><strong>Real-World Use</strong></p>

<p>In 2010, researchers mapped Tokyo-area cities onto an agar plate using food. The slime mould grew a network that closely matched the Tokyo rail system.</p>

<p>Tiny local rules. Big brain energy.</p>

</details>


- [Modeling slime mold intelligence through cellular automata by Jordana Wilkes](https://community.wolfram.com/groups/-/m/t/3500639)
- [Setting up the slime mould in the maze](https://youtube.com/shorts/OBYqSr-c6Ks?si=n-J-rjXOjjJtDkGb)
- [Tokyo subway system slime mould short](https://youtube.com/shorts/dGdjsB6xmEU?si=VE4dqRLozRr-QzoD)

## Sandpiles

- [Abelian sandpile dynamics and related work, Physical Review Letters](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.111.238501)
- [Sandpiles explanation video](https://youtu.be/1MtEUErz7Gg?si=QPlVYZP6-EbRhNLf)
- *The Sandpile Model*: how the model works, with a summary and a model on the website
- [10.3. Sand Piles - On Complexity](https://greenteapress.com/complexity2/html/thinkcomplexity2010.html#sec106)

## Forest Fires

<details>
<summary><strong>The Forest Fire Model</strong></summary>

<p><strong>Tiny Spark. Big Drama.</strong></p>

<p>Picture a forest from above. ***Or don't. Just Look at the home page :)*** </p>

<p>Trees grow slowly.<br />
Lightning strikes randomly.<br />
One tree catches fire.<br />
Then its neighbours catch fire.<br />
Then their neighbours catch fire.</p>

<p>Very quickly, one tiny spark becomes everyone’s problem.</p>

<p>This is the <strong>Drossel-Schwabl Forest Fire Model</strong> — a cellular automaton where a forest grows, burns, clears out, and grows again.</p>

<p>It also shows <strong>self-organised criticality</strong>, just like the sandpile: the system naturally moves toward a point where small events can cause tiny fires... or massive disasters.</p>

<p><strong>The Three States</strong></p>

<p><strong>Empty -&gt;</strong> bare ground, ready for new trees<br />
<strong>Tree -&gt;</strong> living tree, waiting peacefully/naively<br />
<strong>Burning -&gt;</strong> tree on fire, about to become empty</p>

<p>The colours show which state each cell is in.</p>

<p><strong>The Four Rules</strong></p>

<p>At each step:</p>

<ol>
  <li><strong>Burning -&gt; Empty</strong></li>
  <li><strong>Tree + burning neighbour -&gt; Burning</strong></li>
  <li><strong>Tree + lightning chance <code>f</code> -&gt; Burning</strong></li>
  <li><strong>Empty + growth chance <code>p</code> -&gt; Tree</strong></li>
</ol>

<p>The model uses the <strong>Moore neighbourhood</strong>, so fire can spread in all eight directions — up, down, sideways, and diagonally. Fire is not polite.</p>

<p>Two probabilities control everything:</p>

<p><strong>p -&gt;</strong> chance of tree growth<br />
<strong>f -&gt;</strong> chance of lightning</p>

<p>For the interesting behaviour, trees must grow back much faster than lightning strikes. This lets large forests build up before one unlucky spark sets things off.</p>

<p>Slightly unrealistic? Yes.<br />
Scientifically useful? Also yes.<br />
Cool enough to allow? Absolutely.</p>

<p><strong>What It Connects To</strong></p>

<p>The forest fire model is a <strong>stochastic CA</strong>, meaning chance is involved, so every run can look different.</p>

<p>It connects to:</p>

<p><strong>Sandpiles -&gt;</strong> slow build-up, sudden release<br />
<strong>Host-pathogen models -&gt;</strong> infection spreading through cells<br />
<strong>Predator-prey models -&gt;</strong> one front advancing through another</p>

<p>The story changes.<br />
The colours change.<br />
But underneath, it is the same CA magic:</p>

<p><strong>local rules, messy patterns, big behaviour.</strong></p>

</details>


- [Forest-fire modeling paper (NPG, 2017)](https://npg.copernicus.org/articles/24/179/2017/npg-24-179-2017.pdf)
- [Examples of Biological Cellular Automata Models - Mathematics LibreTexts](https://math.libretexts.org/Bookshelves/Scientific_Computing_Simulations_and_Modeling/Introduction_to_the_Modeling_and_Analysis_of_Complex_Systems_(Sayama)/11%3A_Cellular_Automata_I__Modeling/11.05%3A_Examples_of_Biological_Cellular_Automata_Models)

## A Good Way to Use This Page

Try moving between three kinds of sources:

- an explainer
- a simulation or video
- a paper or textbook reference

That way, you can connect intuition, implementation, and theory instead of treating them as separate things.
