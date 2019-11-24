# Keccak-$ f[25] $

This project briefly describes how Keccak-$ f[25] $ works.

## Introduction

Keccak is an implementation of SHA-3 Cryptographic Hash Algorithm.
In this report, we discuss a lightweight version Keccak where we set state $ b = 25 = 5 \times 5 \times 2^l $ in its *Sponge* stage. I.e.,  $ l=0 $ and thus there is only **one** *slice* ($ 5 \times 5 $ bits) and 12 rounds as $ n\_rounds = 12 + 2l $.
Each round function consists of 5 steps to process the state: $ \{ \theta \rightarrow \rho \rightarrow \pi \rightarrow \chi \rightarrow \iota \} $. The output of former step would be treated as the input of next, likewise, the output of $ \iota $ step will be feed into $ \theta $ step of next round. We implement 4 of them in this project ( $ \rho $ step excluded). We will discuss these steps in detail in the following sections.

## $\theta$ Step

The $\theta$ Step is defined as below:
$$
\begin{cases}\label{theta}
C[x] = A[x,0] \oplus A[x,1] \oplus A[x,2] \oplus A[x,3] \oplus A[x,4] ,& x \in [0,4] \\
D[x] = C[x-1] \oplus rot(C[x+1],1), & x \in [0,4] \\
A[x,y] = A[x,y] \oplus D[x] , & x,y \in [0,4] \\
\end{cases}
$$

where $ A[x,y] $ indicates the *lane* in *column* $ x $ and *row* $ y $; thus $ C[x] $ is a bitwise $ XOR $ summation between all rows of column $ x $.
Then, $ rot(C[x+1], 1) $ rotates the bits within the lane $ C[x] $.
Particularly, as there is only slice in our implementation, the $ rot $ function makes no changes so that $ rot(C[x+1], 1) = C[x+1] $.
Thereafter, $ D[x] $ combines $ C[x-1] $ and $ C[x+1] $ by $ XOR $ summation.
Finally, the output of each single value in $ A[] $ of this step obtains from the original $ A[x,y] ~XOR~ D[x]$.

An example of this step is shown below, including input and all outputs of intermediate steps.