
!function(){

var CONST = Q.CONST ;
function Point(x, y)
{

    this.x = x || 0;

    this.y = y || 0;
}

Point.prototype.constructor = Point;


// Point.prototype.clone = function ()
// {
//     return new Point(this.x, this.y);
// };


// Point.prototype.copy = function (p) {
//     this.set(p.x, p.y);
// };


// Point.prototype.equals = function (p) {
//     return (p.x === this.x) && (p.y === this.y);
// };


// Point.prototype.set = function (x, y)
// {
//     this.x = x || 0;
//     this.y = y || ( (y !== 0) ? this.x : 0 ) ;
// };


function Matrix()
{

    this.a = 1;

 
    this.b = 0;


    this.c = 0;

    this.d = 1;

    this.tx = 0;

    this.ty = 0;
}

Matrix.prototype.constructor = Matrix;


Matrix.prototype.fromArray = function (array)
{
    this.a = array[0];
    this.b = array[1];
    this.c = array[3];
    this.d = array[4];
    this.tx = array[2];
    this.ty = array[5];
};


Matrix.prototype.toArray = function (transpose)
{
    if (!this.array)
    {
        this.array = new Float32Array(9);
    }

    var array = this.array;

    if (transpose)
    {
        array[0] = this.a;
        array[1] = this.b;
        array[2] = 0;
        array[3] = this.c;
        array[4] = this.d;
        array[5] = 0;
        array[6] = this.tx;
        array[7] = this.ty;
        array[8] = 1;
    }
    else
    {
        array[0] = this.a;
        array[1] = this.c;
        array[2] = this.tx;
        array[3] = this.b;
        array[4] = this.d;
        array[5] = this.ty;
        array[6] = 0;
        array[7] = 0;
        array[8] = 1;
    }

    return array;
};


Matrix.prototype.apply = function (pos, newPos)
{
    newPos = newPos || new Point();

    var x = pos.x;
    var y = pos.y;

    newPos.x = this.a * x + this.c * y + this.tx;
    newPos.y = this.b * x + this.d * y + this.ty;

    return newPos;
};

/**
 * 输入一个点，返回该点被此矩阵变换后的位置。
 *
 * @param pos {Point} 输入的点
 * @param [newPos] {Point} 被变换的点，如果没有会创建一个新的点返回。
 * @return {Point} 新点，通过这个矩阵求逆变换
 */
Matrix.prototype.applyInverse = function (pos, newPos)
{
    newPos = newPos || new Point();

    var id = 1 / (this.a * this.d + this.c * -this.b);

    var x = pos.x;
    var y = pos.y;

    newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
    newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

    return newPos;
};

/**
 * 通过x,y，移动矩阵
 *
 * @param {number} x
 * @param {number} y
 * @return {Matrix} 返回移动后的矩阵
 */
Matrix.prototype.translate = function (x, y){

    this.tx += x;
    this.ty += y;
    return this;

};


Matrix.prototype.scale = function (x, y)
{
    this.a *= x;
    this.d *= y;
    this.c *= x;
    this.b *= y;
    this.tx *= x;
    this.ty *= y;

    return this;
};



Matrix.prototype.rotate = function (angle)
{
    var cos = Math.cos( angle );
    var sin = Math.sin( angle );

    var a1 = this.a;
    var c1 = this.c;
    var tx1 = this.tx;

    this.a = a1 * cos-this.b * sin;
    this.b = a1 * sin+this.b * cos;
    this.c = c1 * cos-this.d * sin;
    this.d = c1 * sin+this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;

    return this;
};


Matrix.prototype.append = function (matrix)
{
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;

    this.a  = matrix.a * a1 + matrix.b * c1;
    this.b  = matrix.a * b1 + matrix.b * d1;
    this.c  = matrix.c * a1 + matrix.d * c1;
    this.d  = matrix.c * b1 + matrix.d * d1;

    this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
    this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;

    return this;
};


Matrix.prototype.prepend = function(matrix)
{
    var tx1 = this.tx;

    if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1)
    {
        var a1 = this.a;
        var c1 = this.c;
        this.a  = a1*matrix.a+this.b*matrix.c;
        this.b  = a1*matrix.b+this.b*matrix.d;
        this.c  = c1*matrix.a+this.d*matrix.c;
        this.d  = c1*matrix.b+this.d*matrix.d;
    }

    this.tx = tx1*matrix.a+this.ty*matrix.c+matrix.tx;
    this.ty = tx1*matrix.b+this.ty*matrix.d+matrix.ty;

    return this;
};


Matrix.prototype.invert = function()
{
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    var tx1 = this.tx;
    var n = a1*d1-b1*c1;

    this.a = d1/n;
    this.b = -b1/n;
    this.c = -c1/n;
    this.d = a1/n;
    this.tx = (c1*this.ty-d1*tx1)/n;
    this.ty = -(a1*this.ty-b1*tx1)/n;

    return this;
};


/**
 * 重置该矩阵为初始值
 */
Matrix.prototype.identity = function ()
{
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;

    return this;
};


Matrix.prototype.clone = function ()
{
    var matrix = new Matrix();
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;

    return matrix;
};

Matrix.prototype.copy = function (matrix)
{
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;

    return matrix;
};

//默认矩阵
Matrix.IDENTITY = new Matrix();

//缓存矩阵
Matrix.TEMP_MATRIX = new Matrix();





function Rectangle(x, y, width, height)
{

    this.x = x || 0;


    this.y = y || 0;


    this.width = width || 0;


    this.height = height || 0;

   
    this.type = Q.CONST.SHAPES.RECT;
}

Rectangle.prototype.constructor = Rectangle;


Rectangle.EMPTY = new Rectangle(0, 0, 0, 0);


Rectangle.prototype.clone = function ()
{
    return new Rectangle(this.x, this.y, this.width, this.height);
};

Rectangle.prototype.contains = function (x, y)
{
    if (this.width <= 0 || this.height <= 0)
    {
        return false;
    }

    if (x >= this.x && x < this.x + this.width)
    {
        if (y >= this.y && y < this.y + this.height)
        {
            return true;
        }
    }

    return false;
};


function Circle(x, y, radius)
{

    this.x = x || 0;


    this.y = y || 0;

    this.radius = radius || 0;

    this.type = CONST.SHAPES.CIRC;
}

Circle.prototype.constructor = Circle;



Circle.prototype.clone = function ()
{
    return new Circle(this.x, this.y, this.radius);
};

Circle.prototype.contains = function (x, y)
{
    if (this.radius <= 0)
    {
        return false;
    }

    var dx = (this.x - x),
        dy = (this.y - y),
        r2 = this.radius * this.radius;

    dx *= dx;
    dy *= dy;

    return (dx + dy <= r2);
};

Circle.prototype.getBounds = function ()
{
    return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
};



function Ellipse(x, y, width, height)
{

    this.x = x || 0;

    this.y = y || 0;

    this.width = width || 0;

    this.height = height || 0;

    this.type = CONST.SHAPES.ELIP;
}

Ellipse.prototype.constructor = Ellipse;



Ellipse.prototype.clone = function ()
{
    return new Ellipse(this.x, this.y, this.width, this.height);
};

Ellipse.prototype.contains = function (x, y)
{
    if (this.width <= 0 || this.height <= 0)
    {
        return false;
    }

  
    var normx = ((x - this.x) / this.width),
        normy = ((y - this.y) / this.height);

    normx *= normx;
    normy *= normy;

    return (normx + normy <= 1);
};

Ellipse.prototype.getBounds = function ()
{
    return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
};



function Polygon(points_)
{
    
    var points = points_;

  
    if (!Array.isArray(points))
    {
        
        points = new Array(arguments.length);

        for (var a = 0; a < points.length; ++a) {
            points[a] = arguments[a];
        }
    }

   
    if (points[0] instanceof Point)
    {
        var p = [];
        for (var i = 0, il = points.length; i < il; i++)
        {
            p.push(points[i].x, points[i].y);
        }

        points = p;
    }

    this.closed = true;

    this.points = points;

    this.type = CONST.SHAPES.POLY;
}

Polygon.prototype.constructor = Polygon;

Polygon.prototype.clone = function ()
{
    return new Polygon(this.points.slice());
};

Polygon.prototype.contains = function (x, y)
{
    var inside = false;

    
    var length = this.points.length / 2;

    for (var i = 0, j = length - 1; i < length; j = i++)
    {
        var xi = this.points[i * 2], yi = this.points[i * 2 + 1],
            xj = this.points[j * 2], yj = this.points[j * 2 + 1],
            intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect)
        {
            inside = !inside;
        }
    }

    return inside;
};


function RoundedRectangle(x, y, width, height, radius)
{

    this.x = x || 0;

    this.y = y || 0;

    this.width = width || 0;

    this.height = height || 0;

    this.radius = radius || 20;

    this.type = CONST.SHAPES.RREC;
}

RoundedRectangle.prototype.constructor = RoundedRectangle;



RoundedRectangle.prototype.clone = function ()
{
    return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
};

RoundedRectangle.prototype.contains = function (x, y)
{
    if (this.width <= 0 || this.height <= 0)
    {
        return false;
    }

    if (x >= this.x && x <= this.x + this.width)
    {
        if (y >= this.y && y <= this.y + this.height)
        {
            return true;
        }
    }

    return false;
};


Q.exports = Point; //[0]
Q.exports = Matrix; //[1]
Q.exports = Rectangle; //[2]
Q.exports = Circle; //[3]
Q.exports = Ellipse; //[4]
Q.exports = Polygon; //[5]
Q.exports = RoundedRectangle; //[6]


}();