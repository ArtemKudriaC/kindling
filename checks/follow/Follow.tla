---------------------------- MODULE Follow ----------------------------
EXTENDS Naturals

CONSTANTS Chats, Looks, Values, Default, CatchUp, MaxCommands

VARIABLES store, mine, shown, chosen, commands

vars == <<store, mine, shown, chosen, commands>>

State == [look : Looks, rec : Values]

Start == [look |-> Default, rec |-> 0]

TypeOK ==
  /\ store \in State
  /\ mine \in [Chats -> State]
  /\ shown \in [Chats -> Looks]
  /\ chosen \in State
  /\ commands \in 0..MaxCommands

Init ==
  /\ store = Start
  /\ mine = [c \in Chats |-> Start]
  /\ shown = [c \in Chats |-> Default]
  /\ chosen = Start
  /\ commands = 0

Follow(c) ==
  /\ store # mine[c]
  /\ mine' = [mine EXCEPT ![c] = store]
  /\ shown' = [shown EXCEPT ![c] = store.look]
  /\ UNCHANGED <<store, chosen, commands>>

Base(c) == IF CatchUp THEN store ELSE mine[c]

Write(c, s) ==
  /\ store' = s
  /\ mine' = [mine EXCEPT ![c] = s]
  /\ shown' = [shown EXCEPT ![c] = s.look]
  /\ commands' = commands + 1

Pick(c, l) ==
  /\ commands < MaxCommands
  /\ Write(c, [Base(c) EXCEPT !.look = l])
  /\ chosen' = [chosen EXCEPT !.look = l]

Set(c, v) ==
  /\ commands < MaxCommands
  /\ Write(c, [Base(c) EXCEPT !.rec = v])
  /\ chosen' = [chosen EXCEPT !.rec = v]

Reload(c) ==
  /\ mine' = [mine EXCEPT ![c] = store]
  /\ shown' = [shown EXCEPT ![c] = store.look]
  /\ UNCHANGED <<store, chosen, commands>>

Next ==
  \E c \in Chats :
    \/ Follow(c)
    \/ Reload(c)
    \/ \E l \in Looks : Pick(c, l)
    \/ \E v \in Values : Set(c, v)

Spec == Init /\ [][Next]_vars /\ \A c \in Chats : WF_vars(Follow(c))

NoTimerSpec == Init /\ [][Next]_vars

StoreIsLastChoice == store = chosen

Converges == <>[](\A c \in Chats : mine[c] = store /\ shown[c] = store.look)
=============================================================================
