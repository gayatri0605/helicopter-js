/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

function degreesToRadians(deg) {
  return (deg * Math.PI) / 180;
}

let craneObCtr = 0;

// A simple crane
/**
 * @typedef CraneProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCrane extends GrObject {
  /**
   * @param {CraneProperties} params
   */
  constructor(params = {}) {
    let crane = new T.Group();

    let exSettings = {
      steps: 2,
      depth: 0.5,
      bevelEnabled: false
    };

    // first, we define the base of the crane.
    // Just draw a curve for the shape, then use three's "ExtrudeGeometry"
    // to create the shape itself.
    /**@type THREE.Shape */
    let base_curve = new T.Shape();
    base_curve.moveTo(-0.5, 0);
    base_curve.lineTo(-0.5, 2);
    base_curve.lineTo(-0.25, 2.25);
    base_curve.lineTo(-0.25, 5);
    base_curve.lineTo(-0.2, 5);
    base_curve.lineTo(-0.2, 5.5);
    base_curve.lineTo(0.2, 5.5);
    base_curve.lineTo(0.2, 5);
    base_curve.lineTo(0.25, 5);
    base_curve.lineTo(0.25, 2.25);
    base_curve.lineTo(0.5, 2);
    base_curve.lineTo(0.5, 0);
    base_curve.lineTo(-0.5, 0);
    let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
    let crane_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let base = new T.Mesh(base_geom, crane_mat);
    crane.add(base);
    base.translateZ(-0.25);

    // Use a similar process to create the cross-arm.
    // Note, we create a group for the arm, and move it to the proper position.
    // This ensures rotations will behave nicely,
    // and we just have that one point to work with for animation/sliders.
    let arm_group = new T.Group();
    crane.add(arm_group);
    arm_group.translateY(4.5);
    let arm_curve = new T.Shape();
    arm_curve.moveTo(-1.5, 0);
    arm_curve.lineTo(-1.5, 0.25);
    arm_curve.lineTo(-0.5, 0.5);
    arm_curve.lineTo(4, 0.4);
    arm_curve.lineTo(4, 0);
    arm_curve.lineTo(-1.5, 0);
    let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
    let arm = new T.Mesh(arm_geom, crane_mat);
    arm_group.add(arm);
    arm.translateZ(-0.25);

    // Finally, add the hanging "wire" for the crane arm,
    // which is what carries materials in a real crane.
    // The extrusion makes this not look very wire-like, but that's fine for what we're doing.
    let wire_group = new T.Group();
    arm_group.add(wire_group);
    wire_group.translateX(3);
    let wire_curve = new T.Shape();
    wire_curve.moveTo(-0.25, 0);
    wire_curve.lineTo(-0.25, -0.25);
    wire_curve.lineTo(-0.05, -0.3);
    wire_curve.lineTo(-0.05, -3);
    wire_curve.lineTo(0.05, -3);
    wire_curve.lineTo(0.05, -0.3);
    wire_curve.lineTo(0.25, -0.25);
    wire_curve.lineTo(0.25, 0);
    wire_curve.lineTo(-0.25, 0);
    let wire_geom = new T.ExtrudeGeometry(wire_curve, exSettings);
    let wire_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.6,
      roughness: 0.3
    });
    let wire = new T.Mesh(wire_geom, wire_mat);
    wire_group.add(wire);
    wire.translateZ(-0.25);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // This is also where we define parameters for UI sliders.
    // These have format "name," "min", "max", "starting value."
    // Sliders are standardized to have 30 "steps" per slider,
    // so if your starting value does not fall on one of the 30 steps,
    // the starting value in the UI may be slightly different from the starting value you gave.
    super(`Crane-${craneObCtr++}`, crane, [
      ["x", -4, 4, 0],
      ["z", -4, 4, 0],
      ["theta", 0, 360, 0],
      ["wire", 1, 3.5, 2],
      ["arm rotation", 0, 360, 0]
    ]);
    // Here, we store the crane, arm, and wire groups as part of the "GrCrane" object.
    // This allows us to modify transforms as part of the update function.
    this.whole_ob = crane;
    this.arm = arm_group;
    this.wire = wire_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    crane.scale.set(scale, scale, scale);
  }

  // Wire up the wire position and arm rotation to match parameters,
  // given in the call to "super" above.
  update(paramValues) {
    this.whole_ob.position.x = paramValues[0];
    this.whole_ob.position.z = paramValues[1];
    this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
    this.wire.position.x = paramValues[3];
    this.arm.rotation.y = degreesToRadians(paramValues[4]);
  }
}

let excavatorObCtr = 0;

// A simple excavator
/**
 * @typedef ExcavatorProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrExcavator extends GrObject {
  /**
   * @param {ExcavatorProperties} params
   */
  constructor(params = {}) {
    let excavator = new T.Group();

    let exSettings = {
      steps: 2,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 2
    };

    // As with the crane, we define the base (treads) of the excavator.
    // We draw a line, then extrude the line with ExtrudeGeometry,
    // to get the "cutout" style object.
    // Note, for this object, we translate each piece by 0.25 on the negative x-axis.
    // This makes rotation about the y-axis work nicely
    // (since the extrusion happens along +z, a y-rotation goes around an axis on the back face of the piece,
    //  rather than an axis through the center of the piece).
    /**@type THREE.Shape */
    let base_curve = new T.Shape();
    base_curve.moveTo(-1, 0);
    base_curve.lineTo(-1.2, 0.2);
    base_curve.lineTo(-1.2, 0.4);
    base_curve.lineTo(-1, 0.6);
    base_curve.lineTo(1, 0.6);
    base_curve.lineTo(1.2, 0.4);
    base_curve.lineTo(1.2, 0.2);
    base_curve.lineTo(1, 0);
    base_curve.lineTo(-1, 0);
    let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
    let excavator_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let base = new T.Mesh(base_geom, excavator_mat);
    excavator.add(base);
    base.translateZ(-0.2);

    // We'll add the "pedestal" piece for the cab of the excavator to sit on.
    // It can be considered a part of the treads, to some extent,
    // so it doesn't need a group of its own.
    let pedestal_curve = new T.Shape();
    pedestal_curve.moveTo(-0.35, 0);
    pedestal_curve.lineTo(-0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0);
    pedestal_curve.lineTo(-0.35, 0);
    let pedestal_geom = new T.ExtrudeGeometry(pedestal_curve, exSettings);
    let pedestal = new T.Mesh(pedestal_geom, excavator_mat);
    excavator.add(pedestal);
    pedestal.translateY(0.6);
    pedestal.translateZ(-0.2);

    // For the cab, we create a new group, since the cab should be able to spin on the pedestal.
    let cab_group = new T.Group();
    excavator.add(cab_group);
    cab_group.translateY(0.7);
    let cab_curve = new T.Shape();
    cab_curve.moveTo(-1, 0);
    cab_curve.lineTo(1, 0);
    cab_curve.lineTo(1.2, 0.35);
    cab_curve.lineTo(1, 0.75);
    cab_curve.lineTo(0.25, 0.75);
    cab_curve.lineTo(0, 1.5);
    cab_curve.lineTo(-0.8, 1.5);
    cab_curve.lineTo(-1, 1.2);
    cab_curve.lineTo(-1, 0);
    let cab_geom = new T.ExtrudeGeometry(cab_curve, exSettings);
    let cab = new T.Mesh(cab_geom, excavator_mat);
    cab_group.add(cab);
    cab.translateZ(-0.2);

    // Next up is the first part of the bucket arm.
    // In general, each piece is just a series of line segments,
    // plus a bit of extra to get the geometry built and put into a group.
    // We always treat the group as the "pivot point" around which the object should rotate.
    // It is helpful to draw the lines for extrusion with the zero at our desired "pivot point."
    // This minimizes the fiddling needed to get the piece placed correctly relative to its parent's origin.
    // The remaining few pieces are very similar to the arm piece.
    let arm_group = new T.Group();
    cab_group.add(arm_group);
    arm_group.position.set(-0.8, 0.5, 0);
    let arm_curve = new T.Shape();
    arm_curve.moveTo(-2.25, 0);
    arm_curve.lineTo(-2.35, 0.15);
    arm_curve.lineTo(-1, 0.5);
    arm_curve.lineTo(0, 0.25);
    arm_curve.lineTo(-0.2, 0);
    arm_curve.lineTo(-1, 0.3);
    arm_curve.lineTo(-2.25, 0);
    let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
    let arm_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.6,
      roughness: 0.3
    });
    let arm = new T.Mesh(arm_geom, arm_mat);
    arm_group.add(arm);
    arm.translateZ(-0.2);

    let forearm_group = new T.Group();
    arm_group.add(forearm_group);
    forearm_group.position.set(-2.1, 0, 0);
    let forearm_curve = new T.Shape();
    forearm_curve.moveTo(-1.5, 0);
    forearm_curve.lineTo(-1.5, 0.1);
    forearm_curve.lineTo(0, 0.15);
    forearm_curve.lineTo(0.15, 0);
    forearm_curve.lineTo(-1.5, 0);
    let forearm_geom = new T.ExtrudeGeometry(forearm_curve, exSettings);
    let forearm = new T.Mesh(forearm_geom, arm_mat);
    forearm_group.add(forearm);
    forearm.translateZ(-0.2);

    let bucket_group = new T.Group();
    forearm_group.add(bucket_group);
    bucket_group.position.set(-1.4, 0, 0);
    let bucket_curve = new T.Shape();
    bucket_curve.moveTo(-0.25, -0.9);
    bucket_curve.lineTo(-0.5, -0.5);
    bucket_curve.lineTo(-0.45, -0.3);
    bucket_curve.lineTo(-0.3, -0.2);
    bucket_curve.lineTo(-0.15, 0);
    bucket_curve.lineTo(0.1, 0);
    bucket_curve.lineTo(0.05, -0.2);
    bucket_curve.lineTo(0.5, -0.7);
    bucket_curve.lineTo(-0.25, -0.9);
    let bucket_geom = new T.ExtrudeGeometry(bucket_curve, exSettings);
    let bucket = new T.Mesh(bucket_geom, arm_mat);
    bucket_group.add(bucket);
    bucket.translateZ(-0.2);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // The parameters for sliders are also defined here.
    super(`Excavator-${excavatorObCtr++}`, excavator, [
      ["x", -10, 10, 0],
      ["z", -10, 10, 0],
      ["theta", 0, 360, 0],
      ["spin", 0, 360, 0],
      ["arm rotate", 0, 50, 45],
      ["forearm rotate", 0, 90, 45],
      ["bucket rotate", -90, 45, 0]
    ]);
    // As with the crane, we save the "excavator" group as the "whole object" of the GrExcavator class.
    // We also save the groups of each object that may be manipulated by the UI.
    this.whole_ob = excavator;
    this.cab = cab_group;
    this.arm = arm_group;
    this.forearm = forearm_group;
    this.bucket = bucket_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    excavator.scale.set(scale, scale, scale);
  }

  // As with the crane, we wire up each saved group with the appropriate parameter defined in the "super" call.
  // Note, with the forearm, there is an extra bit of rotation added, which allows us to create a rotation offset,
  // while maintaining a nice 0-90 range for the slider itself.
  update(paramValues) {
    this.whole_ob.position.x = paramValues[0];
    this.whole_ob.position.z = paramValues[1];
    this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
    this.cab.rotation.y = degreesToRadians(paramValues[3]);
    this.arm.rotation.z = degreesToRadians(-paramValues[4]);
    this.forearm.rotation.z = degreesToRadians(paramValues[5]) + Math.PI / 16;
    this.bucket.rotation.z = degreesToRadians(paramValues[6]);
  }
}

 
  let  forkliftObCtr = 0;

/**
 * @typedef ForkLiftProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class ForkLift extends GrObject {
    /**
     * @param {ForkLiftProperties} params
     */
    constructor(params={}) {

        let forklift = new T.Group();

        let exSettings = {
			steps: 2,
			depth: 0.4,
			bevelEnabled: true,
			bevelThickness: 0.2,
			bevelSize: 0.1,
      bevelSegments: 2
      
		};

        // Rear half.
        let rear = new T.Group();

        
        let rb_group = new T.Group();
        let rb_curve = new T.Shape();
        rb_curve.lineTo(1.5,0);
        rb_curve.lineTo(1.5,.75);
        rb_curve.lineTo(0.95,2.4);
        rb_curve.lineTo(0.55,2.4);
        rb_curve.lineTo(0,0.75);

        let rb_geo = new T.ExtrudeGeometry(rb_curve, exSettings);
        let rb_mat = new T.MeshStandardMaterial();
        let rb = new T.Mesh(rb_geo, rb_mat);
        rb.translateX(-0.75)
        rb.translateZ(-2.4);
        rb.translateY(1);
        rb.rotateX(Math.PI / 2);
        rb_group.add(rb);

        //// Engine.
        // @ts-ignore
        let engine_geo = new T.CubeGeometry(1,1.5,1.8);
        let engine_mat = new T.MeshStandardMaterial();
        let engine = new T.Mesh(engine_geo, engine_mat);
        engine.translateZ(-1.8);
        engine.translateY(1.6);
        rb_group.add(engine);

        let ex_geo = new T.CylinderGeometry(0.1,0.1,2);
        let ex_mat = new T.MeshStandardMaterial();
        let exhaust = new T.Mesh(ex_geo, ex_mat);
        exhaust.translateY(3.3);
        exhaust.translateZ(-1.1);
        exhaust.translateX(-0.2);
        rb_group.add(exhaust);

        //// Rear wheels.
        let wh_geo = new T.CylinderGeometry(1,1,0.7,20);
        let wh_mat = new T.MeshStandardMaterial();
        let lr_wheel = new T.Mesh(wh_geo, wh_mat);
        lr_wheel.translateX(-1.3);
        lr_wheel.translateY(1);
        lr_wheel.translateZ(-2);
        lr_wheel.rotateZ(Math.PI / 2);
        rb_group.add(lr_wheel);
        let rr_wheel = new T.Mesh(wh_geo, wh_mat);
        rr_wheel.translateX(1.3);
        rr_wheel.translateY(1);
        rr_wheel.translateZ(-2);
        rr_wheel.rotateZ(Math.PI / 2);
        rb_group.add(rr_wheel);

        rear.add(rb_group);

        /// Pivot.
        let pivot_geo = new T.CylinderGeometry(0.4,0.4,1);
        let pivot_mat = new T.MeshStandardMaterial();
        let pivot = new T.Mesh(pivot_geo, pivot_mat);
        pivot.translateY(0.8);
        rear.add(pivot);

        // Front half.
        let front = new T.Group();
        /// Bed.
        let fb_group = new T.Group();
        let fb_curve = new T.Shape();
        fb_curve.lineTo(1.5,0);
        fb_curve.lineTo(1.5,.75);
        fb_curve.lineTo(0.95,2);
        fb_curve.lineTo(0.55,2);
        fb_curve.lineTo(0,0.75);

        let fb_geo = new T.ExtrudeGeometry(fb_curve, exSettings);
        let fb_mat = new T.MeshStandardMaterial();
        let fb = new T.Mesh(fb_geo, fb_mat);
        fb.translateX(0.75);
        fb.translateZ(2);
        fb.translateY(1);
        fb.rotateY(Math.PI);
        fb.rotateX(Math.PI / 2);
        fb_group.add(fb);

        /// Cab.
        // @ts-ignore
        let cab_geo = new T.CubeGeometry(1,2.5,1.4);
        let cab_mat = new T.MeshStandardMaterial();
        let cab = new T.Mesh(cab_geo, cab_mat);
        cab.translateY(2);
        cab.translateZ(1.3);
        fb_group.add(cab);

        /// Front wheels.
        let lf_wheel = new T.Mesh(wh_geo, wh_mat);
        lf_wheel.translateX(-1.3);
        lf_wheel.translateY(1);
        lf_wheel.translateZ(1.5);
        lf_wheel.rotateZ(Math.PI / 2);
        fb_group.add(lf_wheel);
        let rf_wheel = new T.Mesh(wh_geo, wh_mat);
        rf_wheel.translateX(1.3);
        rf_wheel.translateY(1);
        rf_wheel.translateZ(1.5);
        rf_wheel.rotateZ(Math.PI / 2);
        fb_group.add(rf_wheel);

        /// Forks.
        let fork_group = new T.Group();
        let max_fork_height = 9;

        //// Fork pivot.
        let fp_geo = new T.CylinderGeometry(0.2,0.2,1.5);
        let fp_mat = new T.MeshStandardMaterial();
        let f_pivot = new T.Mesh(fp_geo, fp_mat);
        f_pivot.rotateZ(Math.PI / 2);
        fork_group.add(f_pivot);

        //// Forks vertical slider (two decks).
        ///// Deck 1.
        let d1 = new T.Group();
        // @ts-ignore
        let vs_geo = new T.CubeGeometry(0.2,5,.4);
        let vs_mat = new T.MeshStandardMaterial();
        let d1ls = new T.Mesh(vs_geo, vs_mat);
        d1ls.translateX(0.75);
        d1ls.translateY(2.1);
        d1.add(d1ls);

        let d1rs = new T.Mesh(vs_geo, vs_mat);
        d1rs.translateX(-0.75);
        d1rs.translateY(2.1);
        d1.add(d1rs);

        fork_group.add(d1);

        ///// Deck 2.
        let d2 = new T.Group();
        // @ts-ignore
        let d2vs_geo = new T.CubeGeometry(0.2,4.5,.4);
        let d2ls = new T.Mesh(d2vs_geo, vs_mat);
        d2ls.translateX(0.5);
        d2ls.translateY(2.7);
        d2ls.translateZ(0.2);
        d2.add(d2ls);

        let d2rs = new T.Mesh(d2vs_geo, vs_mat);
        d2rs.translateX(-0.5);
        d2rs.translateY(2.7);
        d2rs.translateZ(0.2);
        d2.add(d2rs);

        fork_group.add(d2);

        ///// Backplane.
        let lift_group = new T.Group();

        // @ts-ignore
        let bp_geo = new T.CubeGeometry(3,2,0.1);
        let bp_mat = new T.MeshStandardMaterial();
        let bp = new T.Mesh(bp_geo, bp_mat);
        lift_group.add(bp);

        lift_group.translateZ(0.4);
        // lift_group.translateY(1);

        ///// Forks.
        let fork_len = 2;
        let fg_rot = new T.Group();
        // @ts-ignore
        let fork_geo = new T.CubeGeometry(0.3,0.07,fork_len);
        let fork_mat = new T.MeshStandardMaterial();
        let l_fork = new T.Mesh(fork_geo, fork_mat);
        l_fork.translateX(1);
        l_fork.translateZ(1);
        fg_rot.add(l_fork);

        let r_fork = new T.Mesh(fork_geo, fork_mat);
        r_fork.translateX(-1);
        r_fork.translateZ(1);
        fg_rot.add(r_fork);

        fg_rot.translateY(-1);
        lift_group.add(fg_rot);
        fork_group.add(lift_group);

        fork_group.translateZ(2.3);
        fork_group.translateY(1);
        fb_group.add(fork_group);

        front.add(fb_group);

        forklift.add(front);
        forklift.add(rear);

        super(`Forklift-${forkliftObCtr++}`,forklift,
              [ ['x',-10,10,0],
                ['z',-10,10,0],
                ['theta',0,360,0],
                ['twist',-40,40,0],
                ['fork angle',-5,15,45],
                ['fork height',0.3,9,10000],
                ['fork width',0.3,1.1,0]
              ]);

        
        this.whole_ob = forklift;
        this.rear = rear;
        this.fork_pivot = fork_group;
        this.max_fork_height = max_fork_height;
        this.lift_group = lift_group;
        this.deck2 = d2;
        this.forks_lr = [l_fork, r_fork];
        this.fg_rot = fg_rot;
        this.fork_len = fork_len;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }
    update (paramValues) {
        this.whole_ob.position.x = paramValues[0];
        this.whole_ob.position.z = paramValues[1];
        this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
        this.rear.rotation.y = degreesToRadians(paramValues[3]);
        this.fork_pivot.rotation.x = degreesToRadians(paramValues[4]);
        this.lift_group.position.y = paramValues[5];
        if (this.lift_group.position.y > 5.5) {
            this.deck2.position.y = paramValues[5] - 5.4;
        } else {
            this.deck2.position.y = 0;
        }
        this.forks_lr[0].position.x = paramValues[6];
        this.forks_lr[1].position.x = -1*paramValues[6];
        let min_g_dist = this.fork_len * Math.sin(this.fork_pivot.rotation.x);
        if (this.lift_group.position.y < min_g_dist) {
            this.fg_rot.rotation.x = -1* Math.asin(min_g_dist / this.fork_len);
        } else {
            this.fg_rot.rotation.x = 0;
        }
    }
}

let gantrycraneObCtr = 0;

/**
 * @typedef GantryCraneProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GantryCrane extends GrObject {
    /**
     * @param {ForkLiftProperties} params
     */
    constructor(params={}) {

       
        // x:= length
        // z:= width
        // y:= height

       
        let length  = 20;
        let width   = 20;
        let height  = 10;
        let crane = new T.Group();

        // Corner posts.
        // @ts-ignore
        let post_geo = new T.CubeGeometry(1,height,1);
        let post_mat = new T.MeshStandardMaterial({
          color: "purple"
        });

        for (let i=-1; i<1; i++) {
            for (let j=-1; j<1; j++) {
                let post = new T.Mesh(post_geo, post_mat);
                post.translateX(i*(length-1)+length/2-0.5);
                post.translateZ(j*(width-1)+width/2-0.5);
                post.translateY(height/2);
                crane.add(post);
            }
        }

        // Support posts.
        let supportdia = 0.2;
        let numz = 4;
        let supportdistance = (length-1)/(numz + 1);

        let supp_post_geo = new T.CylinderGeometry(supportdia,supportdia,height);
        let supp_post_mat = new T.MeshStandardMaterial();

        for (let i=0; i<5; i++) {
            
            let supp_post_l = new T.Mesh(supp_post_geo, supp_post_mat);
            let supp_post_r = supp_post_l.clone();

            if ((i!=0)) {
                supp_post_l.translateX(length/2 - supportdistance*i - 1/2);
                supp_post_l.translateZ(width/2-0.4);
                supp_post_l.translateY(height/2);
                crane.add(supp_post_l);

                supp_post_r.translateX(length/2 - supportdistance*i - 1/2);
                supp_post_r.translateZ(-width/2+0.4);
                supp_post_r.translateY(height/2);
                crane.add(supp_post_r);
            }
        }

        // X-rails.
        // @ts-ignore
        let xr_geo = new T.CubeGeometry(length,0.2,1.1);
        let xr_mat = new T.MeshStandardMaterial();
        let lx_rail = new T.Mesh(xr_geo, xr_mat);
        lx_rail.translateZ(length/2-0.5);
        lx_rail.translateY(height);
        crane.add(lx_rail);

        let rx_rail = new T.Mesh(xr_geo, xr_mat);
        rx_rail.translateZ(-length/2+0.5);
        rx_rail.translateY(height);
        crane.add(rx_rail);

        /// X rail trucks.
        let xgroup = new T.Group();

        // @ts-ignore
        let xrt_geo = new T.CubeGeometry(4,0.4,1.2);
        let xrt_mat = new T.MeshStandardMaterial();
        let lxr_truck = new T.Mesh(xrt_geo, xrt_mat);
        lxr_truck.translateZ(length/2-0.5);
        lxr_truck.translateY(height+0.2);
        xgroup.add(lxr_truck);

        let rxr_truck = new T.Mesh(xrt_geo, xrt_mat);
        rxr_truck.translateZ(-length/2+0.5);
        rxr_truck.translateY(height+0.2);
        xgroup.add(rxr_truck);

        //// Z-rail.

        // @ts-ignore
        let zr_geo = new T.CubeGeometry(1,1,width);
        let zr_mat = new T.MeshStandardMaterial();
        let zr = new T.Mesh(zr_geo, zr_mat);
        zr.translateY(height+0.7);
        xgroup.add(zr);

        ///// Z-rail truck.
        let zgroup = new T.Group();

        // @ts-ignore
        let zrt_geo = new T.CubeGeometry(1.5,1.6,4);
        let zrt_mat = new T.MeshStandardMaterial();
        let zrt = new T.Mesh(zrt_geo,zrt_mat);
        zrt.translateY(height+0.7);
        zgroup.add(zrt);

        let rb_geo = new T.CylinderGeometry(2,1.9,0.2,24);
        let rb_mat = new T.MeshStandardMaterial();
        let rb = new T.Mesh(rb_geo, rb_mat);
        rb.translateY(height-0.2);
        zgroup.add(rb);

        ////// Crane base (rotates).
        let cb_group = new T.Group();

        let cb_geo = new T.CylinderGeometry(2,2,0.2,24);
        let cb_mat = new T.MeshStandardMaterial();
        let cb = new T.Mesh(cb_geo, cb_mat);
        cb.translateY(height-0.4);
        cb_group.add(cb);

        /////// Control booth.
        // @ts-ignore
        let cbt_geo = new T.CubeGeometry();
        let cbt_mat = new T.MeshStandardMaterial();
        let cbt = new T.Mesh(cbt_geo, cbt_mat);
        cbt.translateY(height-1);
        cbt.translateX(1.7);
        cb_group.add(cbt);

        /////// Crane claw / grapple (up and down).
        let claw_group = new T.Group();

        let clawBase = 2;
        let clawWidth = 8;

        // @ts-ignore
        let clawBase_geo = new T.CubeGeometry(clawBase,0.5,clawWidth);
        let clawBase_mat = new T.MeshStandardMaterial();
        let cbase = new T.Mesh(clawBase_geo, clawBase_mat);
        claw_group.add(cbase);
        claw_group.translateY(height-1);

        //////// Claw grabby bits.
        let clawGrab = [];

        // @ts-ignore
        let claw_geo = new T.CubeGeometry(0.2,1,0.2);
        let claw_mat = new T.MeshStandardMaterial();
        let claw;

        for (let i=0; i<2; i++) {
            for (let j=0; j<2; j++) {
                claw = new T.Mesh(claw_geo, claw_mat);
                claw.translateX(i*clawBase - clawBase/2);
                claw.translateY(-0.2);
                claw.translateZ(j*clawWidth - clawWidth/2);
                clawGrab.push(claw);
                claw_group.add(claw);
            }
        }

        cb_group.add(claw_group);
        zgroup.add(cb_group);
        xgroup.add(zgroup);
        crane.add(xgroup);

        super(`GantryCrane-${gantrycraneObCtr++}`,crane,
              [ ['gantry x',-7.33,7.33,0],
                ['gantry z',-6.7,6.7,0],
                ['grabber rotate',0,360,0],
                ['grabber height',0.3,9.3,9.3],
                ['claw grab',0,1,0]
              ]);

        this.whole_ob = crane;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        // @ts-ignore
        

        this.x_axis = xgroup;
        this.z_axis = zgroup;
        this.r_axis = cb_group;
        this.y_axis = claw_group;
        this.claw_pos = clawGrab;
    }


    update(paramValues) {
        this.x_axis.position.x = paramValues[0];
        this.z_axis.position.z = paramValues[1];
        this.r_axis.rotation.y = degreesToRadians(paramValues[2]);
        this.y_axis.position.y = paramValues[3];
        this.claw_pos[0].position.x = paramValues[4]/4*Math.sin(Math.PI/4) - 1;
        this.claw_pos[0].position.z = paramValues[4]/4*Math.sin(Math.PI/4) - 4;
        this.claw_pos[1].position.x = 1 - paramValues[4]/4*Math.sin(Math.PI/4);
        this.claw_pos[1].position.z = 4 - paramValues[4]/4*Math.sin(Math.PI/4);
        this.claw_pos[2].position.x = paramValues[4]/4*Math.sin(Math.PI/4) - 1;
        this.claw_pos[2].position.z = 4 - paramValues[4]/4*Math.sin(Math.PI/4);
        this.claw_pos[3].position.x = 1 - paramValues[4]/4*Math.sin(Math.PI/4);
        this.claw_pos[3].position.z = paramValues[4]/4*Math.sin(Math.PI/4) - 4;

    }
}


