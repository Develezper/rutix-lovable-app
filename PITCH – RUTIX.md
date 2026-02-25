# PITCH – RUTIX (Technical Strategic Version)

## 👥 Who Is Speaking

Hello, we are the **RUTIX** team.

I am Juan Pablo, Backend Developer.  
With me are:
- **Santiago** – Data & Systems Architecture  
- **Franklin** – Frontend Developer  
- **Camilo** – Backend Developer  

Today we present **RUTIX**, a collaborative bus navigation platform for the Aburrá Valley.

---

## ⏱ What Problem Are We Solving? (30 seconds)

In urban mobility, bus transportation faces a structural problem:

Route information:
- Is not centralized  
- Is not updated  
- Is not reliable  

People don’t know which bus to take, where to transfer, or which option is the most efficient.

The result:
Time loss, uncertainty, and inefficient mobility.

The problem is not transportation availability.  
It is the lack of structured and validated information.

---

## ⚙ How Does Our Solution Change the Process? (60 seconds)

RUTIX models the bus system as a **structured graph**:

- Bus stops → Nodes  
- Route connections → Edges  
- Costs → Estimated time + transfer penalties  

We use classical route optimization algorithms to calculate the minimum total travel time.

The system’s intelligence does not rely on assumptions, but on real-world data:

1. Users can record bus trips.  
2. Time is counted only when real vehicle movement is detected.  
3. GPS traces are stored by segments.  
4. Similar routes are compared using geospatial proximity analysis.  
5. When multiple users repeat the same pattern, the system consolidates the route automatically.

A lightweight AI layer supports the system by:

- Detecting similarity between trajectories  
- Dynamically adjusting average travel times  
- Prioritizing routes with higher historical evidence  

The AI supports decision-making, but the core logic is algorithmic and deterministic.

Our interface is intelligent because it:

- Autocompletes destinations in real time  
- Orders routes by efficiency and reliability  
- Improves with each new recorded trip  
- Enables community validation  

---

## 🖥 Live Demo (60 seconds)

Now we will show the platform.

👉 **rutix.lovable.app**

1. We search for an origin and destination.  
2. The system calculates optimized routes with transfers.  
3. We compare alternatives before starting.  
4. The full route is previewed on the map.

Next, we activate:
**“I’m on this bus.”**

- The map follows real-time movement.  
- Time is tracked only during actual motion.  
- When finished, a confirmation message appears:  
  **“Route saved successfully.”**

Users can also:
- View their route history  
- Access the admin panel to detect repeated patterns and validate routes  

---

## 🎯 Closing

RUTIX is not just another map application.

It is a logical, collaborative route-building system,
where real user data improves urban mobility.

Technology does not replace the user.  
It empowers them.
