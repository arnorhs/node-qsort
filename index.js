// The current implementation was derived from *BSD system qsort(), by Eugene Zatepyakin <zatepyakin@gmail.com>
// as part of the jsfeat project (https://github.com/inspirit/jsfeat)
//
// Copyright (c) 1992, 1993
// The Regents of the University of California.  All rights reserved.

module.exports = function(array, low, high, cmp) {
    if (typeof low === "function") {
        cmp = low;
        low = 0;
        high = array.length-1;
    }
    qsort(array, low, high, cmp);
};

var qsort_stack = new Int32Array(48*2);

function qsort(array, low, high, cmp) {
    var isort_thresh = 7;
    var t,ta,tb,tc;
    var sp=0, left=0, right=0, i=0, n=0, m=0, ptr=0, ptr2=0, d=0;
    var left0=0, left1=0, right0=0, right1=0, pivot=0, a=0, b=0, c=0, swap_cnt=0;

    var stack = qsort_stack;

    if ((high - low + 1) <= 1) return;

    stack[0] = low;
    stack[1] = high;

    while (sp >= 0) {
        left = stack[sp << 1];
        right = stack[(sp << 1) + 1];
        sp--;

        for(;;) {
            n = (right - left) + 1;

            if (n <= isort_thresh) {
                //insert_sort:
                for (ptr = left + 1; ptr <= right; ptr++) {
                    for (ptr2 = ptr; ptr2 > left && cmp(array[ptr2],array[ptr2-1]); ptr2--) {
                        t = array[ptr2];
                        array[ptr2] = array[ptr2-1];
                        array[ptr2-1] = t;
                    }
                }
                break;
            } else {
                swap_cnt = 0;

                left0 = left;
                right0 = right;
                pivot = left + (n>>1);

                if( n > 40 ) {
                    d = n >> 3;
                    a = left; b = left + d; c = left + (d<<1);
                    ta = array[a]; tb = array[b]; tc = array[c];
                    left = cmp(ta, tb) ? (cmp(tb, tc) ? b : (cmp(ta, tc) ? c : a))
                                      : (cmp(tc, tb) ? b : (cmp(ta, tc) ? a : c));

                    a = pivot - d; b = pivot; c = pivot + d;
                    ta = array[a]; tb = array[b]; tc = array[c];
                    pivot = cmp(ta, tb) ? (cmp(tb, tc) ? b : (cmp(ta, tc) ? c : a))
                                      : (cmp(tc, tb) ? b : (cmp(ta, tc) ? a : c));

                    a = right - (d<<1); b = right - d; c = right;
                    ta = array[a]; tb = array[b]; tc = array[c];
                    right = cmp(ta, tb) ? (cmp(tb, tc) ? b : (cmp(ta, tc) ? c : a))
                                      : (cmp(tc, tb) ? b : (cmp(ta, tc) ? a : c));
                }

                a = left; b = pivot; c = right;
                ta = array[a]; tb = array[b]; tc = array[c];
                pivot = cmp(ta, tb) ? (cmp(tb, tc) ? b : (cmp(ta, tc) ? c : a))
                                   : (cmp(tc, tb) ? b : (cmp(ta, tc) ? a : c));
                if( pivot != left0 ) {
                    t = array[pivot];
                    array[pivot] = array[left0];
                    array[left0] = t;
                    pivot = left0;
                }
                left = left1 = left0 + 1;
                right = right1 = right0;

                ta = array[pivot];
                for(;;) {
                    while( left <= right && !cmp(ta, array[left]) ) {
                        if( !cmp(array[left], ta) ) {
                            if( left > left1 ) {
                                t = array[left1];
                                array[left1] = array[left];
                                array[left] = t;
                            }
                            swap_cnt = 1;
                            left1++;
                        }
                        left++;
                    }

                    while( left <= right && !cmp(array[right], ta) ) {
                        if( !cmp(ta, array[right]) ) {
                            if( right < right1 ) {
                                t = array[right1];
                                array[right1] = array[right];
                                array[right] = t;
                            }
                            swap_cnt = 1;
                            right1--;
                        }
                        right--;
                    }

                    if( left > right ) break;

                    t = array[left];
                    array[left] = array[right];
                    array[right] = t;
                    swap_cnt = 1;
                    left++;
                    right--;
                }

                if (swap_cnt === 0) {
                    left = left0; right = right0;
                    //goto insert_sort;
                    for (ptr = left + 1; ptr <= right; ptr++) {
                        for (ptr2 = ptr; ptr2 > left && cmp(array[ptr2], array[ptr2-1]); ptr2--) {
                            t = array[ptr2];
                            array[ptr2] = array[ptr2-1];
                            array[ptr2-1] = t;
                        }
                    }
                    break;
                }

                n = Math.min(left1 - left0, left - left1);
                m = (left-n) | 0;
                for (i = 0; i < n; ++i, ++m) {
                    t = array[left0 + i];
                    array[left0 + i] = array[m];
                    array[m] = t;
                }

                n = Math.min(right0 - right1, right1 - right);
                m = (right0 - n + 1) | 0;
                for (i = 0; i < n; ++i, ++m) {
                    t = array[left + i];
                    array[left + i] = array[m];
                    array[m] = t;
                }
                n = left - left1;
                m = right1 - right;
                if (n > 1) {
                    if (m > 1) {
                        if (n > m) {
                            ++sp;
                            stack[sp<<1] = left0;
                            stack[(sp<<1)+1] = left0 + n - 1;
                            left = right0 - m + 1; right = right0;
                        } else {
                            ++sp;
                            stack[sp<<1] = right0 - m + 1;
                            stack[(sp<<1) + 1] = right0;
                            left = left0; right = left0 + n - 1;
                        }
                    } else {
                        left = left0; right = left0 + n - 1;
                    }
                } else if (m > 1) {
                    left = right0 - m + 1; right = right0;
                } else {
                    break;
                }
            }
        }
    }
}
