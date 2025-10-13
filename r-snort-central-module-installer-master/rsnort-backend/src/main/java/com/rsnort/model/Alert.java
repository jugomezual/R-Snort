package com.rsnort.model;

import jakarta.persistence.*;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String timestamp;
    private String proto;
    private String dir;
    
    @Column(name = "src_addr")
    private String srcAddr;

    @Column(name = "src_port")
    private Integer srcPort;

    @Column(name = "dst_addr")
    private String dstAddr;

    @Column(name = "dst_port")
    private Integer dstPort;

    private String msg;
    private Integer sid;
    private Integer gid;
    private Integer priority;

    public Alert() {}

    // Getters y Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getProto() { return proto; }
    public void setProto(String proto) { this.proto = proto; }

    public String getDir() { return dir; }
    public void setDir(String dir) { this.dir = dir; }

    public String getSrcAddr() { return srcAddr; }
    public void setSrcAddr(String srcAddr) { this.srcAddr = srcAddr; }

    public Integer getSrcPort() { return srcPort; }
    public void setSrcPort(Integer srcPort) { this.srcPort = srcPort; }

    public String getDstAddr() { return dstAddr; }
    public void setDstAddr(String dstAddr) { this.dstAddr = dstAddr; }

    public Integer getDstPort() { return dstPort; }
    public void setDstPort(Integer dstPort) { this.dstPort = dstPort; }

    public String getMsg() { return msg; }
    public void setMsg(String msg) { this.msg = msg; }

    public Integer getSid() { return sid; }
    public void setSid(Integer sid) { this.sid = sid; }

    public Integer getGid() { return gid; }
    public void setGid(Integer gid) { this.gid = gid; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
}
